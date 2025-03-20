import type { Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function up(db: Kysely<any>): Promise<void> {
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
  await db.schema
    .createTable('pdf_textize_batches')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('prompt', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('pdf_textize_tasks')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('batch_id', 'text', (col) => col.notNull())
    .addColumn('index', 'integer', (col) => col.notNull())
    .addColumn('prefix', 'text', (col) => col.notNull())
    .addColumn('key', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull()) // 'pdf' or 'image'
    .addColumn('text', 'text', (col) => col.notNull())
    .addColumn('cost', 'integer', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.notNull())
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function down(db: Kysely<any>): Promise<void> {
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
