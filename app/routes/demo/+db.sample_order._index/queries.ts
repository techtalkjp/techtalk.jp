import { db } from '~/services/db.server'

export const listSampleOrders = async (limit = 10) => {
  return await db
    .selectFrom('sampleOrders')
    .selectAll()
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .execute()
}
