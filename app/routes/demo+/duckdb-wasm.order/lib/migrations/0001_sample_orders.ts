/** biome-ignore-all lint/suspicious/noExplicitAny: kysely migration */
import { type Kysely, sql } from 'kysely'

export default {
  up: async (db: Kysely<any>) => {
    await db.schema
      .createTable('sample_orders')
      .addColumn('id', 'text', (c) => c.notNull().primaryKey())
      .addColumn('region', 'text', (c) => c.notNull())
      .addColumn('name', 'text', (c) => c.notNull())
      .addColumn('email', 'text', (c) => c.notNull())
      .addColumn('zip', 'text', (c) => c.notNull())
      .addColumn('country', 'text', (c) => c.notNull())
      .addColumn('prefecture', 'text', (c) => c.notNull())
      .addColumn('city', 'text', (c) => c.notNull())
      .addColumn('address', 'text', (c) => c.notNull())
      .addColumn('phone', 'text', (c) => c.notNull())
      .addColumn('note', 'text', (c) => c.notNull())
      .addColumn('updated_at', 'timestamp', (c) =>
        c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .addColumn('created_at', 'timestamp', (c) =>
        c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .execute()
  },
  down: async (db: Kysely<any>) => {
    await db.schema.dropTable('sample_orders').ifExists().execute()
  },
}
