import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from 'react-router'
import {
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui'
import { InsideForm, OutsideForm } from './forms'
import { schema } from './types'

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return {
      formType: null,
      option: null,
      now: new Date().toISOString(),
      lastResult: submission.reply(),
    }
  }

  return {
    ...submission.value,
    now: new Date().toISOString(),
    lastResult: submission.reply({ resetForm: true }),
  }
}

export default function ConformSelect() {
  return (
    <Stack>
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
