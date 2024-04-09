import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { db, type SampleOrderInsert } from '~/services/db.server'

export const createSampleOrder = async (data: SampleOrderInsert) => {
  return await db
    .insertInto('sample_orders')
    .values({
      id: nanoid(),
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ...data,
    })
    .execute()
}
