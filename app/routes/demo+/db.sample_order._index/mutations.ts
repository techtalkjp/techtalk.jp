import { db, type InsertableSampleOrder } from '~/services/db.server'

export const createSampleOrder = async (data: InsertableSampleOrder) => {
  return await db.insertInto('sampleOrders').values(data).execute()
}
