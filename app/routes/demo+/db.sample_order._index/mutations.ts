import type { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { db, type DB } from '~/services/db.server'

export const createSampleOrder = async (
  data: Omit<Insertable<DB['sampleOrders']>, 'id'>,
) => {
  return await db
    .insertInto('sampleOrders')
    .values({ ...data, id: nanoid() })
    .execute()
}

export const deleteSampleOrder = async (id: string) => {
  return await db.deleteFrom('sampleOrders').where('id', '==', id).execute()
}
