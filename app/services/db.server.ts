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

export const getDb = ({
  url,
  authToken,
}: {
  url: string
  authToken: string
}) => {
  return new Kysely<Database>({
    dialect: new LibsqlDiarect({
      client: createClient({ url, authToken }),
    }),
    plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
  })
}

export { sql }

type InsertableSampleOrder = Omit<Insertable<SampleOrder>, 'id'>
type DB = ReturnType<typeof getDb>
export type { DB, InsertableSampleOrder }
