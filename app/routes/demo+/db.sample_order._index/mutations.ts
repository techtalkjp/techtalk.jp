import { nanoid } from 'nanoid'
import type { DB, InsertableSampleOrder } from '~/services/db.server'

export const createSampleOrder = async (
  db: DB,
  data: InsertableSampleOrder,
) => {
  return await db
    .insertInto('sampleOrders')
    .values({ ...data, id: nanoid() })
    .execute()
}

export const deleteSampleOrder = async (db: DB, id: string) => {
  return await db.deleteFrom('sampleOrders').where('id', '==', id).execute()
}
