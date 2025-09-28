import type { Route } from './+types/proxy.$fileId'
import {
  GoogleApiError,
  GoogleReauthRequiredError,
  withGoogleAccess,
} from './_shared/services/google-oauth.server'
import { commitSession, getSession } from './_shared/services/session.server'

const ALLOWED_IMAGE_TYPES = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
])
const DRIVE_ID_PATTERN = /^[\w-]+$/

export async function loader({ params, request }: Route.LoaderArgs) {
  const { fileId } = params
  if (!fileId || !DRIVE_ID_PATTERN.test(fileId)) {
    return new Response('Bad Request', { status: 400 })
  }
  const url = new URL(request.url)
  const isThumb = url.searchParams.has('thumb')

  const session = await getSession(request.headers.get('Cookie'))

  try {
    const { data: imageResponse, sessionUpdated } = await withGoogleAccess(
      session,
      (accessToken) => fetchDriveImage(accessToken, fileId, isThumb),
    )

    const headers = new Headers(imageResponse.headers)
    if (sessionUpdated) {
      headers.set('Set-Cookie', await commitSession(session))
    }

    return new Response(imageResponse.body, {
      status: imageResponse.status,
      statusText: imageResponse.statusText,
      headers,
    })
  } catch (error) {
    if (error instanceof GoogleReauthRequiredError) {
      const headers = new Headers()
      if (error.sessionUpdated) {
        headers.set('Set-Cookie', await commitSession(session))
      }
      return new Response('Unauthorized', {
        status: 401,
        headers,
      })
    }

    if (error instanceof GoogleApiError) {
      return new Response('Failed to fetch image', {
        status: error.status,
      })
    }

    return new Response('Failed to fetch image', { status: 500 })
  }
}

async function fetchDriveImage(
  accessToken: string,
  fileId: string,
  isThumb: boolean,
): Promise<Response> {
  if (isThumb) {
    const metadataResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=thumbnailLink`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!metadataResponse.ok) {
      throw new GoogleApiError(
        'Failed to fetch file metadata',
        metadataResponse.status,
      )
    }

    const metadata = (await metadataResponse.json()) as {
      thumbnailLink?: string
    }

    if (metadata.thumbnailLink) {
      const thumbResponse = await fetch(metadata.thumbnailLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!thumbResponse.ok) {
        throw new GoogleApiError(
          `Failed to fetch thumbnail for ${fileId}`,
          thumbResponse.status,
        )
      }

      return createSecureImageResponse(thumbResponse, 'image/jpeg')
    }
  }

  const imageResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!imageResponse.ok) {
    throw new GoogleApiError('Failed to fetch image', imageResponse.status)
  }

  return createSecureImageResponse(imageResponse, 'image/jpeg')
}

function createSecureImageResponse(
  upstream: Response,
  fallbackType: string,
): Response {
  const contentTypeHeader = upstream.headers.get('Content-Type') ?? fallbackType
  const normalizedType = contentTypeHeader
    .split(';', 1)[0]
    ?.trim()
    .toLowerCase()
  const isAllowed = normalizedType
    ? ALLOWED_IMAGE_TYPES.has(normalizedType)
    : false
  const safeType = isAllowed ? contentTypeHeader : 'application/octet-stream'

  const headers = new Headers()
  headers.set('Content-Type', safeType)
  headers.set('Cache-Control', 'private, max-age=3600')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('Content-Security-Policy', "default-src 'none'; sandbox")
  if (!isAllowed) {
    headers.set('Content-Disposition', 'attachment')
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
}
