import { LibsqlDiarect } from '@coji/kysely-libsql'
import { createClient } from '@libsql/client'
import { Kysely, sql, type InsertType } from 'kysely'
import type { DB, SampleOrder } from './types'

export const db = new Kysely<DB>({
  dialect: new LibsqlDiarect({
    client: createClient({
      url: `${process.env.TURSO_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    }),
  }),
})

type SampleOrderInsert = Omit<InsertType<SampleOrder>, 'id' | 'created_at'>
export { sql }
export type { SampleOrderInsert }
