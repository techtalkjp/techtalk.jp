import { createClient } from '@libsql/client'

export const libsql = createClient({
  url: process.env.TURSO_URL,
  syncUrl: process.env.TURSO_SYNC_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  syncInterval: 60 * 5, // 5分ごとに同期
})
