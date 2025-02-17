import { google } from '@ai-sdk/google'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { generateObject } from 'ai'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Form, useNavigation } from 'react-router'
import { z } from 'zod'
import {
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
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
  state: inquirySchema.partial(),
  history: z.array(
    z.object({
      role: z.union([z.literal('user'), z.literal('assistant')]),
      content: z.string(),
    }),
  ),
})

const outputSchema = z.object({
  answer: z.string(),
  nextState: inquirySchema.partial(),
  nextStep: z.union([z.literal('input'), z.literal('finish')]),
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
  console.log(submission.value)

  const systemPrompt = `
あなたはユーザからの問い合わせの内容をまとめるAIアシスタントです。
ユーザーは、問い合わせの内容のほか、名前、メールアドレス、電話番号、DMを受け取ることに同意するかどうかを提供する必要があります。

ユーザーはこれまで、以下のフィールドを提供しています。:
- [${submission.value.state?.inquiry ? 'x' : ''}] 問い合わせの内容
- [${submission.value.state?.name ? 'x' : ''}] 名前
- [${submission.value.state?.email ? 'x' : ''}] Eメールアドレス
- [${submission.value.state?.phone ? 'x' : ''}] 電話番号
- [${submission.value.state?.agreeToDM ? 'x' : ''}] DMを受け取ることに同意する

不足しているフィールドをひとつづつ要求します。

ユーザーが一部の情報を提供した場合は、これまでのフィールドと合わせたパラメータを出力しつつ、nextStep を \`input\` に設定して返します。
すべてフィールドが入力済みであれば、nextStep を \`finish\` に設定して会話を終了します。

出力はすべて日本語です。
`
  console.log('systemPrompt', { systemPrompt })
  const result = await generateObject({
    model: google('gemini-2.0-flash-exp'),
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage },
    ],
    schema: outputSchema,
  })
  history.push({ role: 'user', content: userMessage })
  history.push({ role: 'assistant', content: result.object.answer })

  return {
    answer: result.object.answer,
    state: result.object.nextState,
    nextStep: result.object.nextStep,
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
  const state = actionData?.state || {
    inquiry: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    agreeToDM: undefined,
  }
  const history = actionData?.history || [
    { role: 'assistant', content: initialAnswer },
  ]

  return (
    <Stack>
      <ReactMarkdown>{answer}</ReactMarkdown>

      <Form method="post" {...getFormProps(form)}>
        {/* state */}
        <input type="hidden" name="state.inquiry" value={state.inquiry} />
        <input type="hidden" name="state.name" value={state.name} />
        <input type="hidden" name="state.email" value={state.email} />
        <input type="hidden" name="state.phone" value={state.phone} />
        <input
          type="hidden"
          name="inquiry.agreeToDM"
          value={state.agreeToDM ? 'on' : undefined}
        />

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
        <h3 className="font-medium">State</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border-r">Key</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground border-r font-medium">
                問い合わせの内容
              </TableCell>
              <TableCell>{state.inquiry}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground border-r font-medium">
                名前
              </TableCell>
              <TableCell>{state.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground border-r font-medium">
                メールアドレス
              </TableCell>
              <TableCell>{state.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground border-r font-medium">
                電話番号
              </TableCell>
              <TableCell>{state.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground border-r font-medium">
                DMを受け取ることに同意する
              </TableCell>
              <TableCell>
                {state.agreeToDM === undefined
                  ? ''
                  : state.agreeToDM
                    ? 'Yes'
                    : 'No'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>

      <Stack>
        <h3 className="font-medium">History</h3>
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
