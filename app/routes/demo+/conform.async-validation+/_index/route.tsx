import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { setTimeout } from 'node:timers/promises'
import { useEffect } from 'react'
import { Form, useNavigation } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Button, HStack, Input, Label, Stack } from '~/components/ui'
import { useEmailAsyncValidation } from '../validate-email/route'
import type { Route } from './+types/route'

const schema = z.object({
  email: z.string().email({ message: 'メールアドレスを入力' }),
})

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const submission = await parseWithZod(formData, { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  await setTimeout(1000)

  if (submission.value.email !== 'test@example.com') {
    return {
      lastResult: submission.reply({
        fieldErrors: {
          email: ['メールアドレスが重複しています'],
        },
      }),
    }
  }

  return dataWithSuccess(
    {
      intent: 'submit',
      lastResult: submission.reply({ resetForm: true }),
    },
    {
      message: '登録が完了しました。',
      description: `email: ${submission.value.email}`,
    },
  )
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const [form, { email }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onInput',
  })
  const navigation = useNavigation()
  const { isValid, errorMessage, validateEmail, ValidationIndicator } =
    useEmailAsyncValidation()

  // メールが有効な時だけ非同期バリデーションを実行
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (email.valid && email.value) {
      validateEmail(email.value)
    }
  }, [email.valid, email.value])

  return (
    <Form {...getFormProps(form)} method="post">
      <Stack>
        <p className="text-muted-foreground text-sm">
          入力に応じてリアルタイムにバリデーションを行います。
          <br />
          "test@example.com"
          以外のメールアドレスが入力されると非同期でサーバサイドでチェックされて、重複エラーが表示されます。
        </p>

        <Stack>
          <Label htmlFor={email.id}>Email</Label>
          <HStack>
            <Input
              {...getInputProps(email, { type: 'email' })}
              key={email.key}
              data-1p-ignore
            />

            <ValidationIndicator />
          </HStack>

          <div className="text-sm text-red-500">
            {email.errors ? email.errors : errorMessage}
          </div>
        </Stack>

        <Button
          type="submit"
          disabled={!form.valid || !form.dirty || !isValid}
          isLoading={navigation.state === 'submitting'}
        >
          Submit
        </Button>
      </Stack>
    </Form>
  )
}
