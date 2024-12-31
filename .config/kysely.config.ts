import { LibsqlDialect } from '@libsql/kysely-libsql'
import { defineConfig } from 'kysely-ctl'

/**
 * Prefix function for migration and seed files.
 * @returns {string} Prefix string.
 */
const prefixFn = () => {
  const now = new Date()
  return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${now.getHours()}${now.getMinutes()}_`
}

export default defineConfig({
  $production: {
    dialect: new LibsqlDialect({
      url: process.env.TURSO_URL ?? '',
      authToken: process.env.TURSO_AUTH_TOKEN,
    }),
  },
  dialect: new LibsqlDialect({
    url: 'file:./data/dev.db',
  }),
  migrations: {
    migrationFolder: 'kysely/migrations',
    getMigrationPrefix: prefixFn,
  },
  seeds: {
    seedFolder: 'kysely/seeds',
    getSeedPrefix: prefixFn,
  },
})
