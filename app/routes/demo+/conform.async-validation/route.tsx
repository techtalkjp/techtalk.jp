import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { conformZodMessage, parseWithZod } from '@conform-to/zod'
import { setTimeout } from 'node:timers/promises'
import { Form, useNavigation } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Button, Input, Label, Stack } from '~/components/ui'
import type { Route } from './+types/route'

// スキーマを共有する代わりに、スキーマクリエーターを準備します。
function createSchema(options?: {
  isEmailUnique: (email: string) => Promise<boolean>
}) {
  return z.object({
    email: z
      .string()
      .email()
      // メールアドレスが有効な場合にのみ実行されるようにスキーマをパイプします。
      .pipe(
        // 注意：ここでのコールバックは非同期にはできません。
        // クライアント上でzodのバリデーションを同期的に実行するためです。
        z.string().superRefine((email, ctx) => {
          if (typeof options?.isEmailUnique !== 'function') {
            ctx.addIssue({
              code: 'custom',
              message: conformZodMessage.VALIDATION_UNDEFINED, // サーバにフォールバック
              fatal: true,
            })
            return
          }

          // ここに到達した場合、サーバー上でバリデーションが行われているはずです。
          // 結果をプロミスとして返すことで、Zodに非同期であることを知らせます。
          return options.isEmailUnique(email).then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: 'custom',
                message: 'Email is already used',
              })
            }
          })
        }),
      ),
  })
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const submission = await parseWithZod(formData, {
    // `isEmailUnique()` が実装された zod スキーマを作成します。
    schema: createSchema({
      isEmailUnique: async (email: string) => {
        console.log('action isEmailUnique')
        await setTimeout(1000)
        if (email === 'test@example.com') {
          return true
        }
        return false
      },
    }),

    // サーバー上で非同期バリデーションを有効にします。
    // クライアントバリデーションは同期的でなければならないため、
    // クライアントでは `async: true` を設定しません。
    async: true,
  })

  console.log({
    status: submission.status,
    value: submission.status === 'success' ? submission.value : null,
  })

  if (submission.status === 'success') {
    return dataWithSuccess(
      {
        lastResult: submission.reply({ resetForm: true }),
      },
      {
        message: '登録が完了しました。',
        description: `email: ${submission.value.email}`,
      },
    )
  }

  return { lastResult: submission.reply() }
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const [form, { email }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, {
        schema: createSchema(), // isEmailUnique()を実装せずにスキーマを作成
      }),
    shouldValidate: 'onInput',
  })
  const navigation = useNavigation()

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
          <Input
            {...getInputProps(email, { type: 'email' })}
            key={email.key}
            data-1p-ignore
          />
          <div className="text-sm text-red-500">{email.errors}</div>
        </Stack>

        <Button
          type="submit"
          disabled={!form.valid || !form.dirty}
          isLoading={
            navigation.state === 'submitting' &&
            // フォールバックの validation が通ってるとき(=email重複ないのが確認されてる)場合だけローディング表示
            actionData?.lastResult.intent?.type === 'validate' &&
            actionData?.lastResult.error === undefined
          }
        >
          submit
        </Button>
      </Stack>
    </Form>
  )
}
