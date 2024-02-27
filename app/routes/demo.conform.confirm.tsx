import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useNavigation, useRevalidator } from '@remix-run/react'
import { ActionFunctionArgs, json } from '@vercel/remix'
import { setTimeout } from 'timers/promises'
import { z } from 'zod'
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertTitle,
  Button,
  Input,
  Label,
} from '~/components/ui'

const schema = z.object({
  intent: z.enum(['confirm', 'submit']),
  email: z.string().email(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return json({
      result: submission.reply(),
      shouldConfirm: false,
      message: null,
    })
  }

  // intent=confirm で submit された場合は確認ダイアログを表示させるように戻す
  if (submission.value.intent === 'confirm') {
    return json({
      result: submission.reply(),
      shouldConfirm: true,
      message: null,
    })
  }

  // intent=submit で submit された場合は実際に削除
  await setTimeout(1000) // simulate server delay

  return json({
    result: submission.reply(),
    shouldConfirm: false,
    message: { title: '削除しました', description: submission.value.email },
  })
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
    <Form method="POST" className="grid grid-cols-1 gap-4" {...getFormProps(form)}>
      <div>
        <Label htmlFor={email.id}>メールアドレス</Label>
        <Input {...getInputProps(email, { type: 'email' })} />
        <div className="text-sm text-destructive">{email.errors}</div>
      </div>

      {/* intent=confirm で submit: フォームを検証された状態で確認ダイアログを表示させる */}
      <Button type="submit" name="intent" value="confirm" disabled={actionData?.shouldConfirm}>
        削除
      </Button>

      {actionData?.message && (
        <Alert>
          <AlertTitle>{actionData.message.title}</AlertTitle>
          <AlertDescription>{actionData.message.description}</AlertDescription>
        </Alert>
      )}

      {/* 確認ダイアログ */}
      <AlertDialog
        open={actionData?.shouldConfirm}
        onOpenChange={(open) => {
          // キャンセルボタンや ESC キー押下時に閉じられるので、revalidate で再度 loader を実行し、lastResult をリセットして初期状態に戻す
          // email の値は Input の DOM に保持されているので revalidate しても消えない。
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
            {/* intent=submit で submit: 実際に削除 */}
            <AlertDialogAction
              type="submit"
              name="intent"
              value="submit"
              disabled={navigation.state === 'submitting'}
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
