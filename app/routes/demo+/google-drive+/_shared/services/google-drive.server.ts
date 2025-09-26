import type { Session } from 'react-router'
import {
  getSessionTokens,
  refreshAccessToken,
  saveSessionTokens,
} from './google-oauth.server'

export async function fetchDriveFilesWithAuth(
  session: Session,
  folderId: string | null,
  pageToken: string,
  pageSize: number,
) {
  const tokens = getSessionTokens(session)

  if (!tokens) {
    return null // 認証が必要
  }

  try {
    // 現在のトークンで試す
    const result = await fetchDriveFiles(
      tokens.access_token,
      folderId,
      pageToken,
      pageSize,
    )
    return result
  } catch (_error) {
    // トークンをリフレッシュして再試行
    if (tokens.refresh_token) {
      try {
        const newTokens = await refreshAccessToken(tokens.refresh_token)
        saveSessionTokens(session, {
          ...newTokens,
          refresh_token: tokens.refresh_token,
        })

        const result = await fetchDriveFiles(
          newTokens.access_token,
          folderId,
          pageToken,
          pageSize,
        )
        return result
      } catch (_refreshError) {
        // リフレッシュも失敗
        return null
      }
    }
    return null
  }
}

async function fetchDriveFiles(
  accessToken: string,
  folderId: string | null,
  pageToken: string,
  pageSize: number,
) {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
    orderBy: 'createdTime desc',
    fields:
      'nextPageToken,files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,size)',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  })

  // フォルダIDが指定されている場合はそのフォルダ内のファイルを取得
  // 指定されていない場合はルートフォルダのファイルを取得
  // フォルダと画像の両方を取得
  const query = folderId
    ? `'${folderId}' in parents and (mimeType contains 'image/' or mimeType = 'application/vnd.google-apps.folder') and trashed = false`
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
    throw new Error(`Drive API error: ${response.status} - ${error}`)
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

  // 画像URLをプロキシ経由に変換
  const files = (data.files || []).map((file) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    thumbUrl: `/demo/google-drive/proxy/${file.id}?thumb=true`,
    mediaUrl: `/demo/google-drive/proxy/${file.id}`,
    webViewLink: file.webViewLink,
    createdTime: file.createdTime,
    modifiedTime: file.modifiedTime,
    size: file.size,
  }))

  return {
    files,
    nextPageToken: data.nextPageToken || null,
  }
}
