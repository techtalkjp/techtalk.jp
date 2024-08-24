import { nanoid } from 'nanoid'
import { db, type InsertableSampleOrder } from '~/services/db.server'

export const createSampleOrder = async (data: InsertableSampleOrder) => {
  return await db
    .insertInto('sampleOrders')
    .values({ ...data, id: nanoid() })
    .execute()
}

export const deleteSampleOrder = async (id: string) => {
  return await db.deleteFrom('sampleOrders').where('id', '==', id).execute()
}
