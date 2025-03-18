import { useRealtimeBatch } from '@trigger.dev/react-hooks'
import { Badge, HStack } from '~/components/ui'

export const BatchStatus = ({
  batchId,
  publicAccessToken,
}: {
  batchId: string
  publicAccessToken: string
}) => {
  const { runs, error } = useRealtimeBatch(batchId, {
    accessToken: publicAccessToken,
  })

  const isRunning = runs.some((r) => r.status === 'EXECUTING')

  return (
    <div>
      <h3>Runs</h3>
      <ul>
        {runs.map((r) => (
          <li key={r.id}>
            <HStack>
              <div>{r.id}</div>
              <Badge>{r.status}</Badge>
              <div>{r.durationMs}</div>
            </HStack>

            <div>{JSON.stringify(r.payload)}</div>
            <div>{JSON.stringify(r.output)}</div>
          </li>
        ))}
      </ul>

      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  )
}
