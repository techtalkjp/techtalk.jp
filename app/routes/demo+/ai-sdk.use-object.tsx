import { experimental_useObject as useObject } from '@ai-sdk/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui'
import { schema } from './ai-sdk.use-object.api'

export default function DemoAiSdkUseObject() {
  const { isLoading, submit, object } = useObject({
    schema,
    api: '/demo/ai-sdk/use-object/api',
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>useObject</CardTitle>
        <CardDescription>streaming object</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const input = formData.get('input')
            submit(input)
          }}
        >
          <input name="input" />
          <button type="submit" disabled={isLoading}>
            Submit
          </button>

          <pre>{JSON.stringify(object, null, 2)}</pre>
        </form>
      </CardContent>
    </Card>
  )
}
