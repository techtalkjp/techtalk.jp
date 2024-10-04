import { json, type LoaderFunctionArgs } from 'react-router'
import { db, sql } from '~/services/db.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const ret = await sql<{
    now: string
  }>`SELECT CURRENT_TIMESTAMP as now`.execute(db)

  return json({ status: 'ok', now: ret.rows[0]?.now })
}
