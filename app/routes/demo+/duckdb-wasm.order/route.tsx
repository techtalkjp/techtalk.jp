import { useEffect } from 'react'
import { Form, useRevalidator } from 'react-router'
import { Heading } from '~/components/typography'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import type { Route } from './+types/route'
import { disposeDB, getDB } from './lib/db.client'
import { migrateToLatestOnce } from './lib/migrate.client'
import { runSampleOrdersSync } from './lib/runners/sample-orders.runner'
import { ensureScope, getOverview, isStale, runSync } from './lib/sync.client'

export const clientLoader = async () => {
  await migrateToLatestOnce()
  const db = await getDB()
  const tables = await db.introspection.getTables()
  await ensureScope('sample_orders')
  const overview = await getOverview('sample_orders')
  const countRow = await db
    .selectFrom('sample_orders')
    .select(db.fn.count<number>('id').as('count'))
    .executeTakeFirst()
  const count = countRow?.count ?? 0
  const latest = await db
    .selectFrom('sample_orders')
    .selectAll()
    .orderBy('updated_at', 'desc')
    .limit(5)
    .execute()

  return { tables, overview, count, latest }
}

export const clientAction = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString() ?? 'dispose'

  if (intent === 'dispose') {
    await disposeDB()
    return { result: 'disposed' }
  }

  if (intent === 'sync') {
    const runId = await runSync('sample_orders', runSampleOrdersSync)
    return { result: 'synced', runId }
  }

  return { result: 'noop' }
}

export default function OrderDemo({
  loaderData: { tables, overview, count, latest },
  actionData,
}: Route.ComponentProps) {
  const { revalidate } = useRevalidator()

  useEffect(() => {
    if (!overview.running || isStale(overview.running)) return
    const id = setInterval(() => revalidate(), 800)
    return () => clearInterval(id)
  }, [
    overview.running?.run_id,
    overview.running?.heartbeat_at,
    revalidate,
    overview.running,
  ])

  return (
    <Stack gap="lg" className="py-4">
      <Heading as="h2" size="2xl">
        DuckDB Wasm Order Demo
      </Heading>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <HStack gap="md">
            <Form method="POST">
              <input type="hidden" name="intent" value="dispose" />
              <Button type="submit" variant="secondary">
                Dispose DB
              </Button>
            </Form>
            <Form method="POST">
              <input type="hidden" name="intent" value="sync" />
              <Button type="submit">Start / Resume Sync</Button>
            </Form>
          </HStack>

          {actionData?.result && (
            <div className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              <span
                className={
                  actionData.result === 'synced'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }
              >
                {actionData.result}
              </span>
              {actionData.runId && (
                <>
                  <span className="text-muted-foreground"> • Run ID: </span>
                  <span className="font-mono text-xs">{actionData.runId}</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-muted-foreground text-xs">Scope</div>
              <div className="font-medium">sample_orders</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                Last Synced At
              </div>
              <div className="font-medium">
                {String(overview.state?.last_synced_at)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Running</div>
              <div className="flex items-center gap-2 font-medium">
                {overview.running ? (
                  <>
                    <Badge
                      variant={
                        isStale(overview.running) ? 'destructive' : 'default'
                      }
                    >
                      {isStale(overview.running) ? 'stale' : 'active'}
                    </Badge>
                    <span className="truncate">{overview.running.run_id}</span>
                    <span className="text-muted-foreground text-xs">
                      hb: {String(overview.running.heartbeat_at)}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">none</span>
                )}
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="text-muted-foreground text-xs">Last Job</div>
              <div className="flex items-center gap-2 font-medium">
                {overview.last ? (
                  <>
                    <Badge
                      variant={
                        overview.last.status === 'error'
                          ? 'destructive'
                          : overview.last.status === 'success'
                            ? 'secondary'
                            : 'default'
                      }
                    >
                      {overview.last.status}
                    </Badge>
                    <span className="truncate">{overview.last.run_id}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">none</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>sample_orders</CardTitle>
          </CardHeader>
          <CardContent>
            <HStack gap="md" className="mb-2">
              <div className="text-muted-foreground text-xs">Count</div>
              <Badge variant="outline">{count}</Badge>
            </HStack>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>id</TableHead>
                  <TableHead>name</TableHead>
                  <TableHead>region</TableHead>
                  <TableHead>updated_at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latest.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.region}</TableCell>
                    <TableCell>{String(r.updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DB Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Columns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.name}>
                    <TableCell>{table.name}</TableCell>
                    <TableCell>
                      {table.columns.map((col) => col.name).join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Stack>
  )
}

export function HydrateFallback() {
  return <div>Loading...</div>
}
