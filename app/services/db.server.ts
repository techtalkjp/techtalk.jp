import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from 'kysely'
import { getSessionContext } from 'session-context'
import type { DB } from './types'

export const getDb = () => {
  const store = getSessionContext<{ db?: Kysely<DB>; env: Env }>()
  if (!store.db) {
    store.db = new Kysely<DB>({
      dialect: new LibsqlDialect({
        url: store.env.TURSO_URL,
        authToken: store.env.TURSO_AUTH_TOKEN,
      }),
      plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
    })
  }
  return store.db
}

export const db = new Proxy<Kysely<DB>>({} as never, {
  get(target: unknown, props: keyof Kysely<DB>) {
    const instance = getDb()
    const value = getDb()[props]
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  },
})
