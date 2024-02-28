import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = ({ request }: LoaderFunctionArgs) => {
  const serverTime = new Date().toISOString()
  const headers = {
    'Cache-Control':
      'max-age=3600, stale-while-revalidate=360, stale-if-error=360',
  }
  console.log('serverTime:', serverTime)
  return json({ serverTime, headers }, { headers })
}

export default function DemoConformAlert() {
  const { serverTime, headers } = useLoaderData<typeof loader>()
  const clientTime = new Date(serverTime).toISOString()

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 text-sm">
        <pre>{JSON.stringify(headers, null, 2)}</pre>
      </div>
      <div>Server Time</div>
      <div>{serverTime}</div>
      <div>Client Time</div>
      <div>{clientTime}</div>
    </div>
  )
}
