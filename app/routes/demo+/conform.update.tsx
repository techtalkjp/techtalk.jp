import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui'
import { jsonWithError, jsonWithSuccess } from '~/services/single-fetch-toast'

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

export const action = async ({ request, response }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return jsonWithError(response, submission.reply(), {
      message: 'エラーが発生しました',
    })
  }
  return jsonWithSuccess(response, submission.reply({ resetForm: true }), {
    message: '登録しました！',
  })
}

export default function TestPage() {
  const lastResult = useActionData<typeof action>()
  const [form, { message }] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <Form method="POST" className="flex flex-col gap-4" {...getFormProps(form)}>
      <div>
        <Label htmlFor={message.id}>Message</Label>
        <Input
          className="w-full"
          {...getInputProps(message, { type: 'text' })}
          key={message.initialValue}
        />
      </div>
      <div className="text-sm text-destructive">{message.errors}</div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
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
      </div>

      {/* 登録 */}
      <Button type="submit" variant="default">
        登録
      </Button>
    </Form>
  )
}
