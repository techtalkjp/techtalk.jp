import type { Kysely } from 'kysely'
import type { DB } from '../db-schema'
import { getDB } from '../db.client'
import type { SyncRunContext } from '../sync.client'

type Row = DB['sample_orders']

function makeRow(
  id: string,
  t: Date,
  idx: number,
): Omit<Row, 'updated_at' | 'created_at'> & {
  updated_at: Date
  created_at?: Date
} {
  return {
    id,
    region: ['JP', 'US', 'EU'][idx % 3] ?? 'JP',
    name: `User ${id}`,
    email: `${id}@example.com`,
    zip: '100-0001',
    country: 'Japan',
    prefecture: 'Tokyo',
    city: 'Chiyoda',
    address: '1-1-1',
    phone: '03-0000-0000',
    note: 'synced',
    updated_at: t,
    created_at: t,
  }
}

async function upsertBatch(
  db: Kysely<DB>,
  rows: Array<ReturnType<typeof makeRow>>,
): Promise<void> {
  if (rows.length === 0) return
  // DuckDB upsert via ON CONFLICT DO UPDATE
  await db
    .insertInto('sample_orders')
    .values(rows)
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        region: eb.ref('excluded.region'),
        name: eb.ref('excluded.name'),
        email: eb.ref('excluded.email'),
        zip: eb.ref('excluded.zip'),
        country: eb.ref('excluded.country'),
        prefecture: eb.ref('excluded.prefecture'),
        city: eb.ref('excluded.city'),
        address: eb.ref('excluded.address'),
        phone: eb.ref('excluded.phone'),
        note: eb.ref('excluded.note'),
        updated_at: eb.ref('excluded.updated_at'),
      })),
    )
    .execute()
}

export async function runSampleOrdersSync(ctx: SyncRunContext): Promise<void> {
  const db: Kysely<DB> = await getDB()

  // Simulate 3 pages of 20 rows each
  for (let page = 0; page < 3; page++) {
    const now = new Date()
    // Advance timestamp to guarantee monotonic
    const t = new Date(now.getTime() + page * 1000)
    const base = Math.floor(Math.random() * 50)
    const rows = Array.from({ length: 20 }, (_, i) => {
      const id = `ORD-${base + i}`
      return makeRow(id, t, i)
    })

    await upsertBatch(db, rows)

    // Update in-progress watermark and heartbeat
    await ctx.heartbeat({ progressSyncedAt: t })

    // Small pause to emulate work
    await new Promise((r) => setTimeout(r, 200))
  }
  // no explicit return; complete is handled by caller
}
