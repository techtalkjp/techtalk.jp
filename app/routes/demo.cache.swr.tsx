import {
  json,
  type HeadersFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

const header = {
  'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=360',
}

export const headers: HeadersFunction = () => {
  return header
}

export const loader = ({ request }: LoaderFunctionArgs) => {
  const serverTime = new Date().toISOString()
  console.log('serverTime:', serverTime)
  return json({ serverTime })
}

export default function DemoConformAlert() {
  const { serverTime } = useLoaderData<typeof loader>()
  const clientTime = new Date(serverTime).toISOString()

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 text-sm">
        <pre>{JSON.stringify(header, null, 2)}</pre>
      </div>
      <div>Server Time</div>
      <div>{serverTime}</div>
      <div>Client Time</div>
      <div>{clientTime}</div>
    </div>
  )
}
