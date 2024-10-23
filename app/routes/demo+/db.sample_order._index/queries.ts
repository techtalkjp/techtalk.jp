import { getDb } from '~/services/db.server'

export const listSampleOrders = async (limit = 10) => {
  const db = getDb()
  return await db
    .selectFrom('sampleOrders')
    .selectAll()
    .orderBy('createdAt desc')
    .limit(limit)
    .execute()
}
