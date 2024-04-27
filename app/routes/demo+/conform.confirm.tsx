import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from '@remix-run/node'
import {
  Form,
  useActionData,
  useNavigation,
  useRevalidator,
} from '@remix-run/react'
import { setTimeout } from 'node:timers/promises'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
  Label,
} from '~/components/ui'
import { jsonWithSuccess } from '~/services/single-fetch-toast'

const schema = z.object({
  intent: z.enum(['confirm', 'submit']),
  email: z.string().email(),
})

export const action = async ({ request, response }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { result: submission.reply(), shouldConfirm: false }
  }

  // intent=confirm で submit された場合は確認ダイアログを表示させるように戻す
  if (submission.value.intent === 'confirm') {
    return { result: submission.reply(), shouldConfirm: true }
  }

  // intent=submit で submit された場合は実際に削除
  await setTimeout(1000) // simulate server delay

  // 成功: resetForm: true でフォームをリセットさせる
  return jsonWithSuccess(
    response,
    { result: submission.reply({ resetForm: true }), shouldConfirm: false },
    { message: '削除しました', description: submission.value.email }, // toast 表示
  )
}

export default function DemoConformAlert() {
  const actionData = useActionData<typeof action>()
  const [form, { email }] = useForm({
    lastResult: actionData?.result,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const navigation = useNavigation()
  const { revalidate } = useRevalidator()

  return (
    <Form
      method="POST"
      className="grid grid-cols-1 gap-4"
      {...getFormProps(form)}
    >
      <div>
        <Label htmlFor={email.id}>メールアドレス</Label>
        <Input {...getInputProps(email, { type: 'email' })} />
        <div className="text-sm text-destructive">{email.errors}</div>
      </div>

      {/* intent=confirm でフォームを検証された状態で確認ダイアログを表示させる */}
      <Button
        type="submit"
        name="intent"
        value="confirm"
        disabled={actionData?.shouldConfirm}
      >
        削除
      </Button>

      {/* 確認ダイアログ */}
      <AlertDialog
        open={actionData?.shouldConfirm}
        onOpenChange={(open) => {
          // キャンセルボタンや ESC キー押下時に閉じられるので、
          // revalidate で再度 loader を実行し、
          // lastResult をリセットして初期状態に戻す。
          // email の値は Input の DOM に保持されているので
          // revalidate しても消えない。
          !open && revalidate()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>{email.value}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>戻る</AlertDialogCancel>
            {/* intent=submit で実際に削除 */}
            <AlertDialogAction
              type="submit"
              name="intent"
              value="submit"
              isLoading={navigation.state === 'submitting'}
              form={form.id}
            >
              {navigation.state === 'submitting' ? '削除しています...' : '削除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  )
}
