import {
  json,
  type HeadersFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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

const defaultCacheControl = 's-maxage=10, stale-while-revalidate=5'

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const loader = ({ request }: LoaderFunctionArgs) => {
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
  new Date(serverTime).toISOString()

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
        </TableBody>
      </Table>
    </Stack>
  )
}
