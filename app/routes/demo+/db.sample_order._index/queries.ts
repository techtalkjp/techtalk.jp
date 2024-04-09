import { db } from '~/services/db.server'

export const listSampleOrders = async (limit = 10) => {
  return await db.selectFrom('sample_orders').selectAll().limit(limit).execute()
}
