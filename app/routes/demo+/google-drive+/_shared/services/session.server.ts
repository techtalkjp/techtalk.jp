import { createCookieSessionStorage } from 'react-router'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__google_drive_session',
    httpOnly: true,
    maxAge: 60 * 60, // 1時間（デモ用に短縮）
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret-change-me'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage
