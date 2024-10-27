import { db } from '~/services/db.server'

export const getSampleOrder = async (id: string) => {
  return await db
    .selectFrom('sampleOrders')
    .where('id', '==', id)
    .selectAll()
    .executeTakeFirstOrThrow()
}
