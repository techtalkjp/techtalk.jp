import type { DB } from '~/services/db.server'

export const listSampleOrders = async (db: DB, limit = 10) => {
  return await db
    .selectFrom('sampleOrders')
    .selectAll()
    .orderBy('createdAt desc')
    .limit(limit)
    .execute()
}
