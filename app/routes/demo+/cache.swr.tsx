import type { HeadersFunction } from '@remix-run/node'
import {
  Form,
  useLoaderData,
  useNavigation,
  type ClientLoaderFunctionArgs,
} from '@remix-run/react'
import dayjs from 'dayjs'
import { setTimeout } from 'node:timers/promises'
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'

const cacheControl = 's-maxage=60, stale-while-revalidate=120'
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': cacheControl,
  }
}

export const loader = async () => {
  await setTimeout(1000)

  const serverTime = new Date().toISOString()
  return { serverTime }
}

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const serverData = await serverLoader<typeof loader>()
  const clientTime = new Date().toISOString()
  const diff = dayjs(clientTime).diff(dayjs(serverData.serverTime), 'second')
  return {
    ...serverData,
    clientTime,
    diff,
  }
}
clientLoader.hydrate = true

export default function DemoConformAlert() {
  const { serverTime, clientTime, diff } = useLoaderData<typeof clientLoader>()
  const navigation = useNavigation()

  return (
    <Stack>
      <div>
        <div>Cache Control:</div>
        <div className="prose">
          <pre className="overflow-auto whitespace-nowrap">{cacheControl}</pre>
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

      <Form>
        <Button isLoading={navigation.state === 'loading'} className="w-full">
          Revalidate
        </Button>
      </Form>
    </Stack>
  )
}
