import dayjs from 'dayjs'
import type { HeadersFunction } from 'react-router'
import { Form, useNavigation } from 'react-router'
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
import type { Route } from './+types.cache.swr'

const cacheControl = 's-maxage=60, stale-while-revalidate=120'
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': cacheControl,
  }
}

export const loader = () => {
  const serverTime = new Date().toISOString()
  return { serverTime, clientTime: null, diff: null }
}

export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const serverData = await serverLoader()
  const clientTime = new Date().toISOString()
  const diff = dayjs(clientTime).diff(dayjs(serverData.serverTime), 'second')
  return {
    ...serverData,
    clientTime,
    diff,
  }
}
clientLoader.hydrate = true

export default function DemoConformAlert({ loaderData }: Route.ComponentProps) {
  const { serverTime, clientTime, diff } = loaderData
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
