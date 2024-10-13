import type { DB } from '~/services/db.server'

export const getSampleOrder = async (db: DB, id: string) => {
  return await db
    .selectFrom('sampleOrders')
    .where('id', '==', id)
    .selectAll()
    .executeTakeFirstOrThrow()
}
