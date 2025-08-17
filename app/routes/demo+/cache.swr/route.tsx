import dayjs from 'dayjs'
import { data, Form, href, useNavigation } from 'react-router'
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
import type { Route } from './+types/route'

const cacheControl = 's-maxage=60, stale-while-revalidate=120'
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const loader = () => {
  const serverTime = new Date().toISOString()
  return data(
    { serverTime, clientTime: null, diff: null },
    {
      headers: {
        'Cache-Control': cacheControl,
      },
    },
  )
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
      <Stack>
        <div>Cache Control:</div>
        <div className="prose w-full">
          <pre className="overflow-auto whitespace-nowrap">{cacheControl}</pre>
        </div>
      </Stack>

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
        <Button
          isLoading={navigation.formAction === href('/demo/cache/swr')}
          className="w-full"
        >
          Revalidate
        </Button>
      </Form>
    </Stack>
  )
}
