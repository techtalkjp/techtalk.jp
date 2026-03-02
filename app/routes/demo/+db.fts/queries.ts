import { sql } from 'kysely'
import { db } from '~/services/db.server'
import { tokenize } from './tokenize'

export const searchContents = async (query: string) => {
  const tokens = tokenize(query)
  if (!tokens.trim()) return []

  const matchQuery = tokens
    .split(' ')
    .filter(Boolean)
    .map((t) => `"${t.replaceAll('"', '""')}"`)
    .join(' ')

  const result = await sql<{
    id: number
    title: string
    body: string
    createdAt: string
    rank: number
  }>`
    SELECT c.id, c.title, c.body, c.created_at as "createdAt", f.rank
    FROM fts_index f
    JOIN fts_contents c ON c.id = f.rowid
    WHERE fts_index MATCH ${matchQuery}
    ORDER BY f.rank
    LIMIT 20
  `.execute(db)

  return result.rows
}

export const listContents = async (limit = 20) => {
  return await db
    .selectFrom('ftsContents')
    .selectAll()
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .execute()
}
