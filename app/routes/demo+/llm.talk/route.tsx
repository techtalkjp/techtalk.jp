import { google } from '@ai-sdk/google'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { generateText, tool } from 'ai'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Form, useNavigation } from 'react-router'
import { z } from 'zod'
import { Label } from '~/components/ui'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Stack } from '~/components/ui/stack'
import type { Route } from './+types/route'

const inquirySchema = z.object({
  inquiry: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  agreeToDM: z.boolean(),
})

const inputSchema = z.object({
  input: z.string(),
  inquiry: inquirySchema.optional(),
  history: z.array(
    z.object({
      role: z.union([z.literal('user'), z.literal('assistant')]),
      content: z.string(),
    }),
  ),
})

export const loader = () => {
  return {
    answer:
      'こんにちは！私はお問い合わせAIです。お問い合わせの内容はなんですか？',
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: inputSchema })
  if (submission.status !== 'success') {
    return {
      answer: 'Invalid form submission',
      history: [],
      reply: submission.reply(),
    }
  }

  const userMessage = submission.value.input
  const history: { role: 'user' | 'assistant'; content: string }[] =
    submission.value.history

  const systemPrompt = `
あなたはユーザからの問い合わせの内容をまとめるAIアシスタントです。
ユーザーは、問い合わせの内容のほか、名前、メールアドレス、電話番号、DMを受け取ることに同意するかどうかを提供する必要があります。

ユーザーはこれまで、以下のフィールドを提供しています。:
- [${submission.value.inquiry?.inquiry ? 'x' : ''}] 問い合わせの内容
- [${submission.value.inquiry?.name ? 'x' : ''}] 名前
- [${submission.value.inquiry?.email ? 'x' : ''}] Eメールアドレス
- [${submission.value.inquiry?.phone ? 'x' : ''}] 電話番号
- [${submission.value.inquiry?.agreeToDM ? 'x' : ''}] DMを受け取ることに同意する

不足しているフィールドをすべて要求します。
ユーザーが一部の情報を提供した場合は、これまでのフィールドと合わせたパラメータで \`input()\`を呼び出します。
すべてのフィールドが入力済みであれば、\`finish()\`を呼び出します。.
ユーザーがすべての情報を提供した場合、会話を終了します。

出力はすべて日本語です。
`
  const result = await generateText({
    model: google('gemini-2.0-flash-exp'),
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage },
    ],
    toolChoice: 'auto',
    tools: {
      input: tool({
        description: 'update the inquiry',
        parameters: z.object({ inquiry: inquirySchema.optional() }),
        // biome-ignore lint/suspicious/useAwait: <explanation>
        execute: async (params) => {
          console.log('input', { params })
          return { state: 'input', params }
        },
      }),
      finish: tool({
        description: 'Finish the conversation',
        parameters: z.object({ inquiry: inquirySchema }),
        // biome-ignore lint/suspicious/useAwait: <explanation>
        execute: async (params) => {
          console.log('finish', { params })
          return { state: 'finish', params }
        },
      }),
    },
  })
  history.push({ role: 'user', content: userMessage })
  history.push({ role: 'assistant', content: result.text })

  if (result.toolResults[0]?.result.state === 'input') {
    return {
      inquiry: result.toolResults[0].args,
      answer: result.text,
      history,
      reply: submission.reply({ resetForm: true }),
    }
  }

  if (result.toolResults[0]?.result.state === 'finish') {
    result.toolResults[0].result.params
    return {
      inquiry: result.toolResults[0].args,
      answer: result.text,
      history,
      reply: submission.reply({ resetForm: true }),
    }
  }

  return {
    inquiry: submission.value.inquiry,
    answer: result.text,
    history,
    reply: submission.reply({ resetForm: true }),
  }
}

export default function Chat({
  loaderData: { answer: initialAnswer },
  actionData,
}: Route.ComponentProps) {
  const [form, { input }] = useForm({
    lastResult: actionData?.reply,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: inputSchema }),
  })
  const navigation = useNavigation()
  const answer = actionData?.answer || initialAnswer
  const history = actionData?.history || [
    { role: 'assistant', content: initialAnswer },
  ]

  return (
    <Stack>
      <ReactMarkdown>{answer}</ReactMarkdown>

      <Form method="post" {...getFormProps(form)}>
        {/* history */}
        {history.map((m, idx) => (
          <React.Fragment key={`${idx}_${m.role}_${m.content}`}>
            <input type="hidden" name={`history[${idx}].role`} value={m.role} />
            <input
              type="hidden"
              name={`history[${idx}].content`}
              value={m.content}
            />
          </React.Fragment>
        ))}

        <Stack>
          <Stack>
            <Label htmlFor={input.id}>入力</Label>
            <Input
              {...getInputProps(input, { type: 'text' })}
              key={input.key}
              autoFocus
            />
            <div className="text-sm text-red-500">{input.errors}</div>
          </Stack>

          <Button type="submit" isLoading={navigation.state === 'submitting'}>
            Send
          </Button>
        </Stack>
      </Form>

      <Stack>
        <h3>履歴</h3>
        <div className="grid grid-cols-[auto_1fr] gap-4 rounded-md border p-4">
          {history.map((m, i) => (
            <React.Fragment key={`${i}_${m.content}`}>
              <p className="text-muted-foreground">
                {m.role === 'user' ? 'User' : 'Assistant'}
              </p>
              <p>{m.content}</p>
            </React.Fragment>
          ))}
        </div>
      </Stack>
    </Stack>
  )
}
