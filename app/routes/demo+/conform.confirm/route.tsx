import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useNavigation, useRevalidator } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
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
import type { Route } from './+types/route'

const schema = z.object({
  intent: z.enum(['confirm', 'submit']),
  email: z.string().email(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), shouldConfirm: false }
  }

  // intent=confirm で submit された場合は確認ダイアログを表示させるように戻す
  if (submission.value.intent === 'confirm') {
    return { lastResult: submission.reply(), shouldConfirm: true }
  }

  // 成功: resetForm: true でフォームをリセットさせる
  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
      shouldConfirm: false,
    },
    {
      message: '削除しました',
    },
  )
}

export default function DemoConformAlert({ actionData }: Route.ComponentProps) {
  const [form, { email }] = useForm({
    lastResult: actionData?.lastResult,
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
        <div className="text-destructive text-sm">{email.errors}</div>
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
