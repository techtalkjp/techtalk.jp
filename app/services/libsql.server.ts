import { createClient } from '@libsql/client'
import { setInterval } from 'node:timers'

export const useTurso = process.env.NODE_ENV === 'production'
export const useEmbeddedReplica =
  useTurso && !!process.env.TURSO_USE_EMBEDDED_REPLICA

console.log({ useTurso, useEmbeddedReplica })

export const libsql = createClient(
  useEmbeddedReplica
    ? {
        // embedded replica を使う
        url: process.env.DATABASE_URL,
        syncUrl: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        // embedded replica を使わない
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      },
)

const syncReplica = async () => {
  // 立ち上げ時に同期
  console.time('libsql sync intial')
  await libsql.sync()
  console.timeEnd('libsql sync intial')

  // 定期的に同期
  setInterval(async () => {
    const label = `libsql sync ${new Date().toISOString()}`
    console.time(label)
    await libsql.sync()
    console.timeEnd(label)
  }, 1000 * 10)
}

if (useEmbeddedReplica) {
  syncReplica()
}
