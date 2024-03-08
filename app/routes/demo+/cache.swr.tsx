import {
  json,
  type HeadersFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { setTimeout } from 'node:timers/promises'
import { useEffect, useState } from 'react'
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'

const defaultCacheControl = 's-maxage=60, stale-while-revalidate=120'

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await setTimeout(5000)

  const serverTime = new Date().toISOString()
  const cacheControl = defaultCacheControl
  return json(
    { serverTime, cacheControl },
    { headers: { 'Cache-Control': cacheControl } },
  )
}

export default function DemoConformAlert() {
  const { serverTime, cacheControl } = useLoaderData<typeof loader>()
  const [clientTime, setClientTime] = useState<string>('-')

  useEffect(() => {
    setClientTime(new Date().toISOString())
  }, [])

  const diff = dayjs(clientTime).diff(dayjs(serverTime), 'second')

  return (
    <Stack>
      <div>
        <div>Cache Control:</div>
        <div className="prose">
          <pre className=" overflow-auto whitespace-nowrap">{cacheControl}</pre>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Variable</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>Server Time</TableCell>
            <TableCell>{serverTime}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Client Time</TableCell>
            <TableCell>{clientTime}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Diff</TableCell>
            <TableCell>{diff} seconds</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  )
}
