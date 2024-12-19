import { parseWithZod } from '@conform-to/zod'
import { dataWithSuccess } from 'remix-toast'
import {
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui'
import type { Route } from './+types/route'
import { InsideForm, OutsideForm } from './forms'
import { schema } from './types'

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return {
      formType: null,
      option: null,
      now: new Date().toISOString(),
      lastResult: submission.reply(),
    }
  }

  return dataWithSuccess(
    {
      ...submission.value,
      now: new Date().toISOString(),
      lastResult: submission.reply({ resetForm: true }),
    },
    {
      message: 'Form submitted successfully!',
    },
  )
}

export default function ConformSelect({ actionData }: Route.ComponentProps) {
  return (
    <Stack align="stretch">
      <Tabs defaultValue="inside-form">
        <TabsList>
          <TabsTrigger value="inside-form">Inside Form</TabsTrigger>
          <TabsTrigger value="outside-form">Outside Form</TabsTrigger>
        </TabsList>
        <TabsContent value="inside-form">
          <InsideForm />
        </TabsContent>
        <TabsContent value="outside-form">
          <OutsideForm />
        </TabsContent>
      </Tabs>
    </Stack>
  )
}
