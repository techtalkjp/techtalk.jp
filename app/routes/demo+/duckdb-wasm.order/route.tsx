import { Form } from 'react-router'
import { Button } from '~/components/ui'
import type { Route } from './+types/route'
import { disposeDB, getDB } from './lib/db.client'
import { migrateToLatestOnce } from './lib/migrate.client'
import {
  ensureScope,
  getOverview,
  isStale,
  runSync,
  type SyncRunContext,
} from './lib/sync.client'

export const clientLoader = async () => {
  await migrateToLatestOnce()
  const db = await getDB()
  const tables = await db.introspection.getTables()
  await ensureScope('sample_orders')
  const overview = await getOverview('sample_orders')

  return { tables, overview }
}

export const clientAction = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString() ?? 'dispose'

  if (intent === 'dispose') {
    await disposeDB()
    return { result: 'disposed' }
  }

  if (intent === 'sync') {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const run = async (ctx: SyncRunContext) => {
      // Demo runner: 3 heartbeats with advancing watermark
      for (let i = 0; i < 3; i++) {
        await ctx.heartbeat({ progressSyncedAt: new Date().toISOString() })
        await sleep(300)
      }
    }
    const runId = await runSync('sample_orders', run)
    return { result: 'synced', runId }
  }

  return { result: 'noop' }
}

export default function OrderDemo({
  loaderData: { tables, overview },
  actionData,
}: Route.ComponentProps) {
  return (
    <div>
      <h2>DuckDB Wasm Order Demo</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Form method="POST">
          <input type="hidden" name="intent" value="dispose" />
          <Button type="submit">Dispose DB</Button>
        </Form>
        <Form method="POST">
          <input type="hidden" name="intent" value="sync" />
          <Button type="submit">Start / Resume Sync</Button>
        </Form>
      </div>

      {actionData?.result && (
        <p>
          Action result: {actionData.result}
          {actionData.runId ? ` (runId: ${actionData.runId})` : ''}
        </p>
      )}

      <h3>Sync Overview</h3>
      <ul>
        <li>
          <b>scope:</b> sample_orders
        </li>
        <li>
          <b>last_synced_at:</b> {String(overview.state?.last_synced_at) ?? '-'}
        </li>
        <li>
          <b>running:</b>{' '}
          {overview.running
            ? `${overview.running.run_id} / heartbeat=${String(overview.running.heartbeat_at) ?? '-'}${
                isStale(overview.running) ? ' (stale)' : ''
              }`
            : 'none'}
        </li>
        <li>
          <b>last job:</b>{' '}
          {overview.last
            ? `${overview.last.status} (${overview.last.run_id})`
            : 'none'}
        </li>
      </ul>

      <table>
        <thead>
          <tr>
            <th>Tables</th>
            <th>Columns</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.name}>
              <td>{table.name}</td>
              <td>{table.columns.map((col) => col.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function HydrateFallback() {
  return <div>Loading...</div>
}
