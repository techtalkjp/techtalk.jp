import { href, type Session } from 'react-router'
import {
  GoogleApiError,
  type GoogleAccessResult,
  withGoogleAccess,
} from './google-oauth.server'

export type DriveFilesResult = {
  files: Array<{
    id: string
    name: string
    mimeType: string
    thumbUrl: string
    mediaUrl: string
    webViewLink?: string
    createdTime?: string
    modifiedTime?: string
    size?: number
  }>
  nextPageToken: string | null
}

export async function fetchDriveFilesWithAuth(
  session: Session,
  folderId: string | null,
  pageToken: string,
  pageSize: number,
): Promise<GoogleAccessResult<DriveFilesResult>> {
  return await withGoogleAccess(session, (accessToken) =>
    fetchDriveFiles(accessToken, folderId, pageToken, pageSize),
  )
}

async function fetchDriveFiles(
  accessToken: string,
  folderId: string | null,
  pageToken: string,
  pageSize: number,
): Promise<DriveFilesResult> {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
    orderBy: 'createdTime desc',
    fields:
      'nextPageToken,files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,size)',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  })

  const safeFolderId = folderId && /^[\w-]+$/.test(folderId) ? folderId : null
  const query = safeFolderId
    ? `'${safeFolderId}' in parents and (mimeType contains 'image/' or mimeType = 'application/vnd.google-apps.folder') and trashed = false`
    : `(mimeType contains 'image/' or mimeType = 'application/vnd.google-apps.folder') and trashed = false and 'root' in parents`
  params.set('q', query)

  if (pageToken) {
    params.set('pageToken', pageToken)
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new GoogleApiError(
      `Drive API error: ${response.status} - ${error}`,
      response.status,
    )
  }

  interface DriveFile {
    id: string
    name: string
    mimeType: string
    webViewLink?: string
    webContentLink?: string
    thumbnailLink?: string
    createdTime?: string
    modifiedTime?: string
    size?: number
  }

  const data = (await response.json()) as {
    files?: DriveFile[]
    nextPageToken?: string
  }

  const files = (data.files || []).map((file) => {
    const proxyHref = href('/demo/google-drive/proxy/:fileId', { fileId: file.id })
    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      thumbUrl: `${proxyHref}?thumb=true`,
      mediaUrl: proxyHref,
      webViewLink: file.webViewLink,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      size: file.size,
    }
  })

  return {
    files,
    nextPageToken: data.nextPageToken || null,
  }
}
