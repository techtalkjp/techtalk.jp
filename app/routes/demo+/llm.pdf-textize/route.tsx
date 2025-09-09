import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { Form, href, useNavigation } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Button, Input, Label, Stack, Textarea } from '~/components/ui'
import type { Route } from './+types/route'
import { pdfExtractText } from './server/pdf-extract-text.server'

const formSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  prompt: z.string().optional(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })

  if (submission.status !== 'success') {
    return {
      text: null,
      cost: null,
      elapsed: null,
      lastResult: submission.reply(),
    }
  }

  const timeStart = Date.now()
  const { text, cost } = await pdfExtractText({
    file: submission.value.file,
    prompt: submission.value.prompt,
  })
  const timeEnd = Date.now()
  const elapsed = (timeEnd - timeStart) / 1000

  return dataWithSuccess(
    {
      text,
      cost,
      elapsed,
      lastResult: submission.reply({ resetForm: true }),
    },
    'File uploaded',
  )
}

export default function PdfPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })

  return (
    <Form {...getFormProps(form)} method="POST" encType="multipart/form-data">
      <Stack gap="lg">
        <Stack>
          <Label htmlFor={fields.file.id}>PDF or Image File</Label>
          <Input
            {...getInputProps(fields.file, { type: 'file' })}
            accept="image/*,application/pdf"
          />
          <div className="text-sm text-red-500">{fields.file.errors}</div>
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

        {actionData?.cost && (
          <div className="grid grid-cols-[auto_1fr] gap-2 text-sm text-gray-500">
            <div>Elapsed</div>
            <div>{actionData.elapsed.toFixed(1)} seconds</div>
            <div>Prompt</div>
            <div>{actionData?.cost.prompt.tokens?.toLocaleString()} tokens</div>
            <div>Output</div>
            <div>
              {actionData?.cost.completion.tokens?.toLocaleString()} tokens
            </div>
            <div>Total</div>
            <div>{actionData.cost.total.tokens.toLocaleString()} tokens</div>
            <div>Cost</div>
            <div>{actionData.cost.total.jpy.toFixed(1)} JPY</div>
          </div>
        )}

        {actionData?.text && (
          <div className="prose rounded border p-4">
            <div>{actionData.text}</div>
          </div>
        )}

        <Button
          type="submit"
          isLoading={navigation.formAction === href('/demo/llm/pdf-textize')}
        >
          Submit
        </Button>
      </Stack>
    </Form>
  )
}
