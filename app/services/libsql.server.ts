import { createClient } from '@libsql/client'

export const useTurso = true
export const useEmbeddedReplica =
  useTurso && process.env.TURSO_USE_EMBEDDED_REPLICA === '1'

console.log({ useTurso, useEmbeddedReplica })

export const libsql = createClient(
  useEmbeddedReplica
    ? {
        // embedded replica を使う
        url: process.env.DATABASE_URL,
        syncUrl: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
        syncInterval: 60 * 5, // 5分ごとに同期
      }
    : {
        // embedded replica を使わない
        url: process.env.DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      },
)
