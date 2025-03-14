import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from 'kysely'

import type { DB } from './types'
export type { DB }

export const db = new Kysely<DB>({
  dialect: new LibsqlDialect({
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
  plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
})
