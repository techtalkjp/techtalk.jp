import { env } from 'cloudflare:workers'
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from 'kysely'
import { D1Dialect } from 'kysely-d1'

import type { DB } from './types'
export type { DB }

export const db = new Kysely<DB>({
  dialect: new D1Dialect({ database: env.DB }),
  plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
})
