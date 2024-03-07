import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { prisma } from '~/services/prisma.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const requestLogs = await prisma.requestLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  })
  return json({ requestLogs })
}

export default function RequestLogsPage() {
  const { requestLogs } = useLoaderData<typeof loader>()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created At</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>App</TableHead>
          <TableHead>Machine</TableHead>
          <TableHead>URL</TableHead>
        </TableRow>
      </TableHeader>
      {requestLogs.map((log) => (
        <TableRow key={log.id}>
          <TableCell className="whitespace-nowrap">{log.createdAt}</TableCell>
          <TableCell>{log.flyRegion}</TableCell>
          <TableCell>{log.flyAppName}</TableCell>
          <TableCell>{log.flyMachineId}</TableCell>
          <TableCell>{log.url}</TableCell>
        </TableRow>
      ))}
    </Table>
  )
}
