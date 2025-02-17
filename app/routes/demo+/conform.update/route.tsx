import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { MetaFunction } from 'react-router'
import { Form } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import {
  Button,
  FormField,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '~/components/ui'
import type { Route } from './+types/route'

export const meta: MetaFunction = () => {
  return [
    { title: 'conform で外部から値を変更するデモ - Demos' },
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ]
}

const schema = z.object({
  message: z.string(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }
  return dataWithSuccess(
    { lastResult: submission.reply({ resetForm: true }) },
    {
      message: '登録しました',
      description: `メッセージ: ${submission.value.message}`,
    },
  )
}

export default function TestPage({ actionData }: Route.ComponentProps) {
  const lastResult = actionData?.lastResult
  const [form, { message }] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <Form method="POST" className="flex flex-col gap-4" {...getFormProps(form)}>
      <FormField>
        <Label htmlFor={message.id}>Message</Label>
        <Input
          className="w-full"
          {...getInputProps(message, { type: 'text' })}
        />
        <FormMessage id={message.errorId}>{message.errors}</FormMessage>
      </FormField>

      <Stack>
        {/* getButtonProps でやる場合は type='submit' にしないと動かない */}
        <Button
          type="submit"
          variant="outline"
          {...form.update.getButtonProps({
            name: message.name,
            value: 'Hello! from form.update.getButtonProps',
          })}
        >
          getButtonProps で update
        </Button>

        {/* form.update でやる場合は type='button' で OK */}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.update({
              name: message.name,
              value: 'こんにちは！ from form.update',
            })
          }}
        >
          form.update で update
        </Button>

        {/* select の選択に応じて変更 */}
        <Select
          onValueChange={(val) => {
            form.update({ name: message.name, value: val })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="プリセット1">プリセット1</SelectItem>
            <SelectItem value="プリセット2">プリセット2</SelectItem>
            <SelectItem value="プリセット3">プリセット3</SelectItem>
          </SelectContent>
        </Select>

        {/* form.reset.getButtonProps でリセット。submit で。 */}
        <Button
          type="submit"
          variant="outline"
          {...form.reset.getButtonProps({ name: message.name })}
        >
          リセット
        </Button>
      </Stack>

      {/* 登録 */}
      <Button type="submit" variant="default">
        登録
      </Button>
    </Form>
  )
}
