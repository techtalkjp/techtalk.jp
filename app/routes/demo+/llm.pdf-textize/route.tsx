import { google } from '@ai-sdk/google'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { generateText } from 'ai'
import { FileTextIcon, TrashIcon } from 'lucide-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Form, useNavigation } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { FileDrop } from '~/components/file-drop'
import {
  Button,
  HStack,
  Label,
  ScrollArea,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
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
    model: google('gemini-2.0-flash-lite-preview-02-05', {
      structuredOutputs: false,
    }),
    messages: [
      {
        role: 'system',
        content:
          'Analyze the file’s content and output text in Markdown without triple backticks or page numbers.',
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

  const cost = {
    prompt: {
      tokens: result.usage.promptTokens,
      usd: (result.usage.promptTokens / 1000000) * 0.1,
      jpy: (result.usage.promptTokens / 1000000) * 0.1 * usdToJpy,
    },
    completion: {
      tokens: result.usage.completionTokens,
      usd: (result.usage.completionTokens / 1000000) * 0.4,
      jpy: (result.usage.completionTokens / 1000000) * 0.4 * usdToJpy,
    },
    total: {
      tokens: result.usage.promptTokens + result.usage.completionTokens,
      usd:
        (result.usage.promptTokens / 1000000) * 0.075 +
        (result.usage.completionTokens / 1000000) * 0.3,
      jpy:
        ((result.usage.promptTokens / 1000000) * 0.075 +
          (result.usage.completionTokens / 1000000) * 0.3) *
        usdToJpy,
    },
  }

  return {
    lastResult: submission.reply(),
    result: result.text,
    cost,
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
          <Label htmlFor={fields.file.id}>PDF File</Label>
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
                      <div className="font-medium">Drop a PDF file here.</div>
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

            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <ReactMarkdown className="prose">
                {actionData.result}
              </ReactMarkdown>
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
        )}

        <Button type="submit" isLoading={navigation.state === 'submitting'}>
          Submit
        </Button>
      </Stack>
    </Form>
  )
}
