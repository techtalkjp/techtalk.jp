import { google } from '@ai-sdk/google'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { generateText } from 'ai'
import { FileTextIcon, TrashIcon } from 'lucide-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Form, useNavigation } from 'react-router'
import { z } from 'zod'
import { FileDrop } from '~/components/file-drop'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Stack } from '~/components/ui/stack'
import type { Route } from './+types/route'

const formSchema = z.object({
  file: z.instanceof(File),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  const result = await generateText({
    model: google('gemini-2.0-pro-exp-02-05', { structuredOutputs: false }),
    messages: [
      {
        role: 'system',
        content:
          'analyze the contents of this file and output the markdown text',
      },
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: await submission.value.file.arrayBuffer(),
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  })

  const ret = await fetch('https://api.excelapi.org/currency/rate?pair=usd-jpy')
  const usdToJpy = Number(await ret.text())

  return {
    lastResult: submission.reply(),
    result: result.text,
    usage: result.usage,
    usdToJpy,
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
    <Form {...getFormProps(form)} method="POST" encType="multipart/form-data">
      <Stack gap="lg">
        <Stack>
          <Label htmlFor={fields.file.id}>File</Label>
          <FileDrop
            id={fields.file.id}
            name={fields.file.name}
            key={fields.file.key}
            accepts={['.pdf']}
          >
            {({ fileData, removeFile }) => {
              return (
                <div className="bg-muted cursor-pointer rounded-md border-2 px-4 py-8">
                  {fileData.length === 0 && (
                    <div className="text-muted-foreground grid grid-cols-1 place-items-center">
                      <div>
                        <FileTextIcon />
                      </div>
                      <div className="font-medium">Drop files here</div>
                    </div>
                  )}
                  {fileData.length > 0 && (
                    <div className="grid grid-cols-2 place-items-center gap-4">
                      {fileData.map((file, i) => (
                        <React.Fragment key={file.file.name}>
                          <div>{file.file.name}</div>
                          <div className="text-sm">
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => removeFile(i)}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                          <iframe
                            className="col-span-2 h-90 w-full"
                            src={file.url}
                            title="PDF Preview"
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              )
            }}
          </FileDrop>
          <div className="text-sm text-red-500">{fields.file.errors}</div>
        </Stack>

        {actionData?.result && (
          <div className="w-full overflow-auto">
            <ReactMarkdown className="markdown prose">
              {actionData.result}
            </ReactMarkdown>
          </div>
        )}

        {actionData?.usage && (
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">Usage</div>
            <div>Input: {actionData.usage.promptTokens}</div>
            <div>
              {(
                (actionData.usage.promptTokens / 1000000) *
                0.1 *
                actionData.usdToJpy
              ).toFixed(2)}
              <small>円</small>
            </div>
            <div>Output: {actionData.usage.completionTokens}</div>
            <div>
              {(
                (actionData.usage.completionTokens / 1000000) *
                0.4 *
                actionData.usdToJpy
              ).toFixed(2)}
              <small>円</small>
            </div>
          </div>
        )}

        <Button type="submit" isLoading={navigation.state === 'submitting'}>
          Submit
        </Button>
      </Stack>
    </Form>
  )
}
