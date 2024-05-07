import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from '@remix-run/node'
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
      type: null,
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
          <TabsTrigger value="wrong-1">Wrong1</TabsTrigger>
          <TabsTrigger value="wrong-2">Wrong2</TabsTrigger>
          <TabsTrigger value="wrong-3">Wrong3</TabsTrigger>
          <TabsTrigger value="wrong-4">Wrong4</TabsTrigger>
        </TabsList>
        <TabsContent value="inside-form">
          <InsideForm />
        </TabsContent>
        <TabsContent value="outside-form">
          <OutsideForm />
        </TabsContent>
        <TabsContent value="wrong-1">Wrong1 content</TabsContent>
        <TabsContent value="wrong-2">Wrong2 content</TabsContent>
        <TabsContent value="wrong-3">Wrong3 content</TabsContent>
        <TabsContent value="wrong-4">Wrong4 content</TabsContent>
      </Tabs>
    </Stack>
  )
}
