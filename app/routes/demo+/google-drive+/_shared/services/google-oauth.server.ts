import type { Session } from 'react-router'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo'

export interface GoogleTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  scope: string
  token_type: string
}

export interface GoogleUser {
  id: string
  email: string
  name?: string
  picture?: string
}

export function getGoogleOAuthURL(origin: string, state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/demo/google-drive/callback`,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  })

  if (state) params.set('state', state)

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForTokens(
  code: string,
  origin: string,
): Promise<GoogleTokens> {
  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: `${origin}/demo/google-drive/callback`,
    grant_type: 'authorization_code',
  })

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code for tokens: ${error}`)
  }

  return await response.json()
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<GoogleTokens> {
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    grant_type: 'refresh_token',
  })

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh access token: ${error}`)
  }

  return await response.json()
}

export async function getGoogleUser(
  accessToken: string,
): Promise<GoogleUser> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Google user info')
  }

  return await response.json()
}

// セッション管理用のヘルパー関数
export function getSessionTokens(
  session: Session,
): GoogleTokens | null {
  // Cookieセッションからトークンを取得
  const tokens = session.get('google_tokens')
  return tokens || null
}

export function saveSessionTokens(
  session: Session,
  tokens: GoogleTokens,
): void {
  // Cookieセッションにトークンを保存
  session.set('google_tokens', tokens)
}

export function deleteSessionTokens(
  session: Session,
): void {
  // Cookieセッションからトークンを削除
  session.unset('google_tokens')
}