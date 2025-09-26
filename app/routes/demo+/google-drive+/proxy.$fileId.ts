import {
  getSessionTokens,
  refreshAccessToken,
  saveSessionTokens,
} from '~/routes/demo+/google-drive+/_shared/services/google-oauth.server'
import {
  commitSession,
  getSession,
} from '~/routes/demo+/google-drive+/_shared/services/session.server'
import type { Route } from './+types/proxy.$fileId'

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

  // セッションからトークンを取得
  const session = await getSession(request.headers.get('Cookie'))
  const tokens = getSessionTokens(session)

  if (!tokens) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const imageResponse = await fetchDriveImage(
      tokens.access_token,
      fileId,
      isThumb,
    )
    return imageResponse
  } catch (_error) {
    // トークンをリフレッシュして再試行
    if (tokens.refresh_token) {
      try {
        const newTokens = await refreshAccessToken(tokens.refresh_token)
        saveSessionTokens(session, {
          ...newTokens,
          refresh_token: tokens.refresh_token,
        })

        const imageResponse = await fetchDriveImage(
          newTokens.access_token,
          fileId,
          isThumb,
        )
        // セッションをコミットしてトークンを保存
        const headers = new Headers(imageResponse.headers)
        headers.set('Set-Cookie', await commitSession(session))
        return new Response(imageResponse.body, {
          status: imageResponse.status,
          statusText: imageResponse.statusText,
          headers,
        })
      } catch (_refreshError) {
        return new Response('Failed to fetch image', { status: 500 })
      }
    }
    return new Response('Failed to fetch image', { status: 500 })
  }
}

async function fetchDriveImage(
  accessToken: string,
  fileId: string,
  isThumb: boolean,
): Promise<Response> {
  // サムネイルの場合はthumbnailLinkを取得
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
      throw new Error('Failed to fetch file metadata')
    }

    const metadata = (await metadataResponse.json()) as {
      thumbnailLink?: string
    }

    if (metadata.thumbnailLink) {
      // thumbnailLinkを直接取得
      const thumbResponse = await fetch(metadata.thumbnailLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return createSecureImageResponse(thumbResponse, 'image/jpeg')
    }
  }

  // フルサイズ画像を取得
  const imageResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!imageResponse.ok) {
    throw new Error('Failed to fetch image')
  }

  return createSecureImageResponse(imageResponse, 'image/jpeg')
}

function createSecureImageResponse(
  upstream: Response,
  fallbackType: string,
): Response {
  const contentTypeHeader = upstream.headers.get('Content-Type') ?? fallbackType
  const normalizedType = contentTypeHeader.split(';', 1)[0]?.trim().toLowerCase()
  const isAllowed = normalizedType ? ALLOWED_IMAGE_TYPES.has(normalizedType) : false
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
