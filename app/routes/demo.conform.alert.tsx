import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { ActionFunctionArgs } from '@vercel/remix'
import { useState } from 'react'
import { jsonWithError, jsonWithSuccess } from 'remix-toast'
import { setTimeout } from 'timers/promises'
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

const schema = z.object({
  email: z.string().email(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return jsonWithError(submission.reply(), { message: 'Invalid form submission' })
  }

  // Simulate a slow server
  await setTimeout(2000)

  return jsonWithSuccess(submission.reply(), { message: 'Deleted successfly', description: submission.value.email })
}

export default function DemoConformAlert() {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const lastResult = useActionData<typeof action>()
  const [form, { email }] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event, { formData }) => {
      const intent = formData.get('intent')
      if (intent === 'alert') {
        event.preventDefault()
        setIsAlertOpen(true)
      }
    },
    shouldValidate: 'onBlur',
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" className="grid grid-cols-1 gap-4" {...getFormProps(form)}>
      <div>
        <Label htmlFor={email.id}>メールアドレス</Label>
        <Input {...getInputProps(email, { type: 'email' })} />
        <div className="text-sm text-destructive">{email.errors}</div>
      </div>

      <Button type="submit" name="intent" value="alert" disabled={navigation.state === 'submitting'}>
        {navigation.state === 'submitting' ? '削除しています...' : '削除'}
      </Button>

      <AlertDialog open={isAlertOpen} onOpenChange={(open) => setIsAlertOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>このメールアドレスを削除します</AlertDialogTitle>
            <AlertDialogDescription>{email.value}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>戻る</AlertDialogCancel>
            <AlertDialogAction type="submit" name="intent" value="submit" form={form.id}>
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  )
}
