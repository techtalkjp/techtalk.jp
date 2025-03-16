import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useNavigation } from 'react-router'
import { z } from 'zod'
import { MediaFileUploader } from '~/components/media-file-uploader'
import { Button, Label, Stack, Textarea } from '~/components/ui'
import type { Route } from './+types/route'

const formSchema = z.object({
  files: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      type: z.string(),
    }),
  ),
  prompt: z.string().optional(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  console.log(submission.value)

  return {
    lastResult: submission.reply(),
  }
}

export default function PdfPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })

  return (
    <Form {...getFormProps(form)} method="POST">
      <Stack gap="lg">
        <Stack>
          <Label htmlFor={fields.files.id}>PDF or Image Files</Label>
          <MediaFileUploader
            id={fields.files.id}
            name={fields.files.name}
            key={fields.files.key}
            mediaType="pdf"
          />

          <div className="text-sm text-red-500">{fields.files.errors}</div>
        </Stack>

        <Stack>
          <Label htmlFor={fields.prompt.id}>Extra Prompt</Label>
          <Textarea
            {...getTextareaProps(fields.prompt)}
            key={fields.prompt.key}
            placeholder="Optional prompt for the model"
          />
          <div className="text-sm text-red-500">{fields.prompt.errors}</div>
        </Stack>

        {/* 
        {actionData?.result && (
          <Stack>
            <HStack>
              <h3>Result</h3>
              <div className="flex-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // copy to clipboard
                  navigator.clipboard.writeText(actionData.result)
                  toast.info('Copied to clipboard')
                }}
              >
                Copy
              </Button>
            </HStack>

            <ScrollArea className="prose h-[400px] w-full rounded-md border p-4">
              <ReactMarkdown>{actionData.result}</ReactMarkdown>
            </ScrollArea>
          </Stack>
        )}

        {actionData?.cost && (
          <Stack>
            <HStack>
              <h3>コスト</h3>
              <div className="flex-1" />
              <small>(1ドル{actionData.usdToJpy.toFixed(1)}円)</small>
            </HStack>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>種類</TableHead>
                  <TableHead>トークン</TableHead>
                  <TableHead>コスト</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Input</TableCell>
                  <TableCell>
                    {actionData.cost.prompt.tokens.toLocaleString()} tokens
                  </TableCell>
                  <TableCell>
                    {actionData.cost.prompt.jpy.toFixed(2)}円
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Output</TableCell>
                  <TableCell>
                    {actionData.cost.completion.tokens.toLocaleString()} tokens
                  </TableCell>
                  <TableCell>
                    {actionData.cost.completion.jpy.toFixed(2)}円
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>合計</TableCell>
                  <TableCell />
                  <TableCell>
                    {actionData.cost.total.jpy.toFixed(2)}円
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
        )} */}

        <Button type="submit" isLoading={navigation.state === 'submitting'}>
          Submit
        </Button>
      </Stack>
    </Form>
  )
}
