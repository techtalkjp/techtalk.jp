import { LibsqlDiarect } from '@coji/kysely-libsql'
import { createClient } from '@libsql/client'
import {
  CamelCasePlugin,
  Kysely,
  ParseJSONResultsPlugin,
  sql,
  type Insertable,
} from 'kysely'
import type { DB, SampleOrder } from './types'

export const db = new Kysely<DB>({
  dialect: new LibsqlDiarect({
    client: createClient({
      url: `${process.env.TURSO_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    }),
  }),
  plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
})

export { sql }
type InsertableSampleOrder = Omit<Insertable<SampleOrder>, 'id'>
export type { InsertableSampleOrder }
