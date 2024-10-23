import { LibsqlDiarect } from '@coji/kysely-libsql'
import { createClient } from '@libsql/client'
import {
  CamelCasePlugin,
  Kysely,
  ParseJSONResultsPlugin,
  sql,
  type Insertable,
} from 'kysely'
import type { DB as Database, SampleOrder } from './types'

export const getDb = () => {
  return new Kysely<Database>({
    dialect: new LibsqlDiarect({
      client: createClient({
        url: process.env.TURSO_URL ?? '',
        authToken: process.env.TURSO_AUTH_TOKEN ?? '',
      }),
    }),
    plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
  })
}

export { sql }

type InsertableSampleOrder = Omit<Insertable<SampleOrder>, 'id'>
type DB = ReturnType<typeof getDb>
export type { DB, InsertableSampleOrder }
