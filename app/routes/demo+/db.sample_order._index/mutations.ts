import { nanoid } from 'nanoid'
import { getDb, type InsertableSampleOrder } from '~/services/db.server'

export const createSampleOrder = async (data: InsertableSampleOrder) => {
  const db = getDb()
  return await db
    .insertInto('sampleOrders')
    .values({ ...data, id: nanoid() })
    .execute()
}

export const deleteSampleOrder = async (id: string) => {
  const db = getDb()
  return await db.deleteFrom('sampleOrders').where('id', '==', id).execute()
}
