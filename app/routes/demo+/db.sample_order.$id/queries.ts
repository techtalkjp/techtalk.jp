import { getDb } from '~/services/db.server'

export const getSampleOrder = async (id: string) => {
  const db = getDb()
  return await db
    .selectFrom('sampleOrders')
    .where('id', '==', id)
    .selectAll()
    .executeTakeFirstOrThrow()
}
