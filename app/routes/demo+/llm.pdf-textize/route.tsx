import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useNavigation } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { MediaFileUploader } from '~/components/media-file-uploader'
import { Button, Label, Stack, Textarea } from '~/components/ui'
import { pdfExtractTextTask } from '~/trigger/pdf-extract-text'
import type { Route } from './+types/route'
import { BatchStatus } from './components/batch-status'

const formSchema = z.object({
  files: z
    .array(
      z.object({
        prefix: z.string(),
        key: z.string(),
        name: z.string(),
        type: z.union([z.literal('image'), z.literal('pdf')]),
      }),
    )
    .min(1, 'At least one file is required'),
  prompt: z.string().optional(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { handle: null, lastResult: submission.reply() }
  }

  const items = submission.value.files.map((file) => ({
    payload: {
      file,
      prompt: submission.value.prompt,
    },
  }))
  const handle = await pdfExtractTextTask.batchTrigger(items)

  return dataWithSuccess(
    {
      handle,
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
    <Form {...getFormProps(form)} method="POST">
      <Stack gap="lg">
        <Stack>
          <Label htmlFor={fields.files.id}>PDF or Image Files</Label>
          <MediaFileUploader
            id={fields.files.id}
            name={fields.files.name}
            key={fields.files.key}
            mediaType={['image', 'pdf']}
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

        {actionData?.handle && (
          <Stack>
            <h3>Handle</h3>
            <pre>{actionData.handle.batchId}</pre>

            {
              <BatchStatus
                batchId={actionData.handle.batchId}
                publicAccessToken={actionData.handle.publicAccessToken}
              />
            }
          </Stack>
        )}

        <Button type="submit" isLoading={navigation.state === 'submitting'}>
          Submit
        </Button>

        <div>{JSON.stringify(form.allErrors)}</div>
      </Stack>
    </Form>
  )
}
