import { sql, type Kysely, type Selectable } from 'kysely'
import type { DB } from './db-schema'
import { getDB } from './db.client'

export type SyncScope = 'sample_orders' | (string & {})

export type SyncStateRow = Selectable<DB['sync_state']>

export type SyncJobStatus = 'running' | 'success' | 'error'

export type SyncJobRow = Selectable<DB['sync_job']>

export type SyncOverview = {
  state: SyncStateRow | null
  running: SyncJobRow | null
  last: SyncJobRow | null
}

export async function ensureScope(scope: SyncScope): Promise<SyncStateRow> {
  const db: Kysely<DB> = await getDB()
  const existing: SyncStateRow | undefined = await db
    .selectFrom('sync_state')
    .selectAll()
    .where('scope', '=', scope)
    .executeTakeFirst()

  if (existing) return existing

  await db.insertInto('sync_state').values({ scope }).execute()
  const created: SyncStateRow | undefined = await db
    .selectFrom('sync_state')
    .selectAll()
    .where('scope', '=', scope)
    .executeTakeFirst()
  if (!created) throw new Error('failed to create sync_state')
  return created
}

export async function getOverview(scope: SyncScope): Promise<SyncOverview> {
  const db: Kysely<DB> = await getDB()
  const state: SyncStateRow | null =
    (await db
      .selectFrom('sync_state')
      .selectAll()
      .where('scope', '=', scope)
      .executeTakeFirst()) ?? null

  const running: SyncJobRow | null =
    (await db
      .selectFrom('sync_job')
      .selectAll()
      .where('scope', '=', scope)
      .where('status', '=', 'running')
      .orderBy('started_at', 'desc')
      .executeTakeFirst()) ?? null

  const last: SyncJobRow | null =
    (await db
      .selectFrom('sync_job')
      .selectAll()
      .where('scope', '=', scope)
      .where('status', '!=', 'running')
      .orderBy('started_at', 'desc')
      .executeTakeFirst()) ?? null

  return { state, running, last }
}

export async function getRunningJob(
  scope: SyncScope,
): Promise<SyncJobRow | null> {
  const db: Kysely<DB> = await getDB()
  const job: SyncJobRow | null =
    (await db
      .selectFrom('sync_job')
      .selectAll()
      .where('scope', '=', scope)
      .where('status', '=', 'running')
      .orderBy('started_at', 'desc')
      .executeTakeFirst()) ?? null
  return job
}

export async function getJob(runId: string): Promise<SyncJobRow | null> {
  const db: Kysely<DB> = await getDB()
  const job: SyncJobRow | null =
    (await db
      .selectFrom('sync_job')
      .selectAll()
      .where('run_id', '=', runId)
      .executeTakeFirst()) ?? null
  return job
}

function newRunId(): string {
  return crypto.randomUUID()
}

export type StartOptions = {
  scope: SyncScope
}

export async function startOrResume({
  scope,
}: StartOptions): Promise<SyncJobRow> {
  const db: Kysely<DB> = await getDB()

  // Ensure state row
  const state = await ensureScope(scope)

  // Reuse running job if any (resume)
  const existing = await getRunningJob(scope)
  if (existing) return existing

  // Start new job
  const run_id = newRunId()
  await db
    .insertInto('sync_job')
    .values({
      run_id,
      scope,
      status: 'running',
      heartbeat_at: sql<Date>`CURRENT_TIMESTAMP`,
      from_synced_at: state.last_synced_at ?? null,
      from_cursor: state.last_cursor ?? null,
      progress_synced_at: state.last_synced_at ?? null,
      progress_cursor: state.last_cursor ?? null,
    })
    .execute()

  const job = await getJob(run_id)
  if (!job) throw new Error('failed to create sync_job')
  return job
}

export type HeartbeatOptions = {
  runId: string
  progressSyncedAt?: Date | null
  progressCursor?: string | null
}

export async function heartbeat({
  runId,
  progressSyncedAt,
  progressCursor,
}: HeartbeatOptions): Promise<void> {
  const db: Kysely<DB> = await getDB()
  let qb = db
    .updateTable('sync_job')
    .set({ heartbeat_at: sql<Date>`CURRENT_TIMESTAMP` })
    .where('run_id', '=', runId)
    .where('status', '=', 'running')
  if (typeof progressSyncedAt !== 'undefined') {
    qb = qb.set({ progress_synced_at: progressSyncedAt })
  }
  if (typeof progressCursor !== 'undefined') {
    qb = qb.set({ progress_cursor: progressCursor })
  }
  await qb.execute()
}

export async function complete(runId: string): Promise<void> {
  const db: Kysely<DB> = await getDB()
  const job = await getJob(runId)
  if (!job) return

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable('sync_job')
      .set({ status: 'success', finished_at: sql<Date>`CURRENT_TIMESTAMP` })
      .where('run_id', '=', runId)
      .where('status', '=', 'running')
      .execute()

    // Commit watermark
    await trx
      .updateTable('sync_state')
      .set({
        last_synced_at: job.progress_synced_at ?? null,
        last_cursor: job.progress_cursor ?? null,
        updated_at: sql<Date>`CURRENT_TIMESTAMP`,
      })
      .where('scope', '=', job.scope)
      .execute()
  })
}

export async function fail(runId: string, error: unknown): Promise<void> {
  const db: Kysely<DB> = await getDB()
  const message = error instanceof Error ? error.message : String(error)
  await db
    .updateTable('sync_job')
    .set({
      status: 'error',
      error: message,
      finished_at: sql<Date>`CURRENT_TIMESTAMP`,
    })
    .where('run_id', '=', runId)
    .where('status', '=', 'running')
    .execute()
}

export function isStale(
  job: Pick<SyncJobRow, 'heartbeat_at'>,
  staleMs = 60_000,
): boolean {
  if (!job.heartbeat_at) return true
  const t = new Date(job.heartbeat_at).getTime()
  return Number.isFinite(t) ? Date.now() - t > staleMs : true
}

// 高レベル API: ランナーを差し替えて同期を実行（UI から呼び出し）
export type SyncRunContext = {
  scope: SyncScope
  runId: string
  fromSyncedAt: Date | null
  fromCursor: string | null
  progressSyncedAt: Date | null
  progressCursor: string | null
  heartbeat: (opts?: {
    progressSyncedAt?: Date | null
    progressCursor?: string | null
  }) => Promise<void>
}

export type SyncRunner = (ctx: SyncRunContext) => Promise<void>

export async function runSync(
  scope: SyncScope,
  runner: SyncRunner,
): Promise<string> {
  const job = await startOrResume({ scope })
  const ctx: SyncRunContext = {
    scope,
    runId: job.run_id,
    fromSyncedAt: job.from_synced_at,
    fromCursor: job.from_cursor,
    progressSyncedAt: job.progress_synced_at,
    progressCursor: job.progress_cursor,
    heartbeat: (opts) => heartbeat({ runId: job.run_id, ...opts }),
  }
  try {
    await runner(ctx)
    await complete(job.run_id)
  } catch (e) {
    await fail(job.run_id, e)
    throw e
  }
  return job.run_id
}
