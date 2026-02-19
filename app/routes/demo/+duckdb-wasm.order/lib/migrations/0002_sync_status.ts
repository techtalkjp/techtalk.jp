/** biome-ignore-all lint/suspicious/noExplicitAny: kysely migration */
import { type Kysely, sql } from 'kysely'

// 履歴あり構成:
// - sync_state: データセット(scope)ごとの最終成功ウォーターマーク
// - sync_job:   各ジョブ(run_id)の進行状況と履歴
export default {
  up: async (db: Kysely<any>) => {
    // 高水位マーカー
    await db.schema
      .createTable('sync_state')
      .addColumn('scope', 'text', (c) => c.notNull().primaryKey())
      .addColumn('last_synced_at', 'timestamp') // Δ同期の基準（時刻ベース運用時）
      .addColumn('last_cursor', 'text') // 外部カーソル運用時の最終値
      .addColumn('updated_at', 'timestamp', (c) =>
        c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .addColumn('created_at', 'timestamp', (c) =>
        c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .execute()

    // ジョブ履歴 + 途中経過（再開ポイント）
    await db.schema
      .createTable('sync_job')
      .addColumn('run_id', 'text', (c) => c.notNull().primaryKey())
      .addColumn('scope', 'text', (c) => c.notNull())
      .addColumn('status', 'text', (c) => c.notNull().defaultTo(sql`'running'`))
      .addColumn('started_at', 'timestamp', (c) =>
        c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .addColumn('heartbeat_at', 'timestamp')
      .addColumn('finished_at', 'timestamp')
      // どこから開始したか（前回成功のウォーターマーク）
      .addColumn('from_synced_at', 'timestamp')
      .addColumn('from_cursor', 'text')
      // 途中経過の再開ポイント（確定前）
      .addColumn('progress_synced_at', 'timestamp')
      .addColumn('progress_cursor', 'text')
      // 最後のエラー内容（失敗時の調査用）
      .addColumn('error', 'text')
      .addColumn('updated_at', 'timestamp', (c) =>
        c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .addColumn('created_at', 'timestamp', (c) =>
        c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
      )
      .execute()
  },
  down: async (db: Kysely<any>) => {
    await db.schema.dropTable('sync_job').ifExists().execute()
    await db.schema.dropTable('sync_state').ifExists().execute()
  },
}
