import type { ActionFunctionArgs } from '@remix-run/node'
import { Await, Form, useActionData } from '@remix-run/react'
import { setTimeout } from 'node:timers/promises'
import { Suspense, useState } from 'react'
import { Button, Progress, Stack } from '~/components/ui'

export const action = ({ request }: ActionFunctionArgs) => {
  const progress = Array.from({ length: 100 }, (_, i) => i + 1).map(
    (i) =>
      new Promise<number>((resolve) =>
        setTimeout(i * 100).then(() => resolve(i)),
      ),
  )
  return { progress }
}

export default function ProgressIndexPage() {
  const actionData = useActionData<typeof action>()
  const [progress, setProgress] = useState(0)
  return (
    <Stack>
      <Form method="POST">
        <Button>Submit</Button>
      </Form>

      <Progress value={progress} />

      <div className="break-all">
        {actionData?.progress.map((p, i) => (
          <Suspense
            key={`progress-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              i
            }`}
          >
            <Await resolve={p}>
              {(p) => {
                // @ts-ignore
                setProgress(p)
                // @ts-ignore
                return <span className="mr-1">{p}</span>
              }}
            </Await>
          </Suspense>
        ))}
      </div>

      {progress === 100 && <div className="font-bold">action completed!</div>}
    </Stack>
  )
}
