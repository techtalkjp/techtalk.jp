import { Buffer } from 'node:buffer'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import type { Session } from 'react-router'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo'

const tokenEncryptionSecret =
  process.env.TOKEN_ENCRYPTION_SECRET ?? process.env.SESSION_SECRET
if (!tokenEncryptionSecret) {
  throw new Error('TOKEN_ENCRYPTION_SECRET or SESSION_SECRET must be set')
}

const TOKEN_KEY = createHash('sha256')
  .update(tokenEncryptionSecret)
  .digest()
const TOKEN_ALGORITHM = 'aes-256-gcm'

function encryptTokens(tokens: GoogleTokens): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(TOKEN_ALGORITHM, TOKEN_KEY, iv)
  const plaintext = JSON.stringify(tokens)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

function decryptTokens(serialized: string): GoogleTokens {
  const buffer = Buffer.from(serialized, 'base64')
  if (buffer.length < 28) {
    throw new Error('Invalid token payload')
  }
  const iv = buffer.subarray(0, 12)
  const authTag = buffer.subarray(12, 28)
  const ciphertext = buffer.subarray(28)
  const decipher = createDecipheriv(TOKEN_ALGORITHM, TOKEN_KEY, iv)
  decipher.setAuthTag(authTag)
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8')
  return JSON.parse(decrypted) as GoogleTokens
}

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

  const tokens = (await response.json()) as GoogleTokens
  return {
    ...tokens,
    refresh_token: tokens.refresh_token ?? refreshToken,
  }
}

export async function getGoogleUser(accessToken: string): Promise<GoogleUser> {
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
export function getSessionTokens(session: Session): GoogleTokens | null {
  const stored = session.get('google_tokens')
  if (typeof stored !== 'string') return null
  try {
    return decryptTokens(stored)
  } catch (_error) {
    session.unset('google_tokens')
    return null
  }
}

export function saveSessionTokens(
  session: Session,
  tokens: GoogleTokens,
): void {
  session.set('google_tokens', encryptTokens(tokens))
}

export function deleteSessionTokens(session: Session): void {
  // Cookieセッションからトークンを削除
  session.unset('google_tokens')
}
