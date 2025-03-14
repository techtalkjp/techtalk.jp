import { sql } from 'kysely'
import { db } from '~/services/db.server'
import type { Route } from './+types/healthcheck'

export const loader = async ({ context }: Route.LoaderArgs) => {
  if (!db) {
    throw new Error('Database connection not available')
  }

  const ret = await sql<{
    now: string
  }>`SELECT CURRENT_TIMESTAMP as now`.execute(db)

  return Response.json({ status: 'ok', now: ret.rows[0]?.now })
}
