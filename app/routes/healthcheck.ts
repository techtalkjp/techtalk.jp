import { getDb, sql } from '~/services/db.server'
import type * as Route from './+types.healthcheck'

export const loader = async ({ context }: Route.LoaderArgs) => {
  const db = getDb()
  if (!db) {
    throw new Error('Database connection not available')
  }

  const ret = await sql<{
    now: string
  }>`SELECT CURRENT_TIMESTAMP as now`.execute(db)

  return { status: 'ok', now: ret.rows[0]?.now }
}
