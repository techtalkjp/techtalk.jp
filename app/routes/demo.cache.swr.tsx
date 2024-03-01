import {
  json,
  type HeadersFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Label,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'

const defaultCacheControl = 'public, s-maxage=30, stale-while-revalidate=360'

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  console.log({ loaderHeaders })
  return loaderHeaders
}

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const serverTime = new Date().toISOString()
  const cacheControl =
    url.searchParams.get('cache-control') ?? defaultCacheControl
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
      <Form className="col-span-2 text-sm">
        <Stack>
          <div>
            <Label>Cache Control</Label>
            <Input
              className="overflow-auto whitespace-nowrap"
              name="cache-control"
              defaultValue={cacheControl}
            />
          </div>
          <Button>Update</Button>
        </Stack>
      </Form>

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
