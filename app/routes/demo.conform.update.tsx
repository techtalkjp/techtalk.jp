import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionData } from '@remix-run/react'
import { json, type ActionFunctionArgs } from '@vercel/remix'
import { z } from 'zod'

const schema = z.object({
  message: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return json({ lastResult: submission.reply(), actionMessage: 'Action Error!' })
  }
  return json({ lastResult: submission.reply(), actionMessage: 'Action Success!' })
}

export default function TestPage() {
  const actionData = useActionData<typeof action>()

  const [form, { message }] = useForm({
    lastResult: actionData?.lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">conform で外部から値を変更するデモ</h1>

      <form method="POST" className="flex flex-col gap-4" {...getFormProps(form)}>
        <label htmlFor={message.id}>Message</label>
        <input {...getInputProps(message, { type: 'text' })} key={message.initialValue} />
        <div className="text-destructive">{message.errors}</div>

        <div className="grid grid-cols-4 gap-4">
          {/* getButtonProps でやる場合は type='submit' にしないと動かない */}
          <button
            type="submit"
            className="border"
            {...form.update.getButtonProps({
              name: message.name,
              value: 'Hello! from form.update.getButtonProps',
            })}
          >
            getButtonProps で update
          </button>

          {/* form.update でやる場合は type='button' で OK */}
          <button
            type="button"
            className="border"
            onClick={() => {
              form.update({
                name: message.name,
                value: 'こんにちは！ from form.update',
              })
            }}
          >
            form.update で update
          </button>

          {/* select の選択に応じて変更 */}
          <select onChange={(e) => form.update({ name: message.name, value: e.target.value })}>
            <option value="" selected>
              選択してください
            </option>
            <option>プリセット1</option>
            <option>プリセット2</option>
            <option>プリセット3</option>
          </select>

          {/* form.reset.getButtonProps でリセット。submit で。 */}
          <button type="submit" className="border" {...form.reset.getButtonProps({ name: message.name })}>
            リセット
          </button>
        </div>

        {/* 登録 */}
        <button type="submit" className="border">
          登録
        </button>
      </form>

      {actionData?.lastResult && <div>{actionData?.actionMessage}</div>}
    </div>
  )
}
