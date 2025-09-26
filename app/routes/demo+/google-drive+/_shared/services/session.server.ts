import { createCookieSessionStorage } from 'react-router'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__google_drive_session',
    httpOnly: true,
    maxAge: 60 * 60, // 1時間（デモ用に短縮）
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage
