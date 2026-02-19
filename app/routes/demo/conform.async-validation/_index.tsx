import {
  type Intent,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react'
import { conformZodMessage, parseWithZod } from '@conform-to/zod/v4'
import { CheckIcon, XIcon } from 'lucide-react'
import { setTimeout } from 'node:timers/promises'
import { Form, useNavigation } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Button, HStack, Input, Label, Stack } from '~/components/ui'
import { cn } from '~/libs/utils'
import type { Route } from './+types/_index'

function createSchema(
  intent: Intent | null,
  options?: {
    isEmailUnique: (email: string) => Promise<boolean>
  },
) {
  return z.object({
    email: z
      .email({ message: 'メールアドレスを入力' })
      .superRefine((email, ctx) => {
        const isValidatingEmail =
          intent === null ||
          (intent.type === 'validate' && intent.payload.name === 'email')

        if (!isValidatingEmail) {
          ctx.addIssue({
            code: 'custom',
            message: conformZodMessage.VALIDATION_SKIPPED,
          })
          return
        }

        if (typeof options?.isEmailUnique !== 'function') {
          ctx.addIssue({
            code: 'custom',
            message: conformZodMessage.VALIDATION_UNDEFINED,
            fatal: true,
          })
          return
        }

        return options.isEmailUnique(email).then((isUnique) => {
          if (!isUnique) {
            ctx.addIssue({
              code: 'custom',
              message: 'メールアドレスが重複しています',
            })
          }
        })
      }),
  })
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const submission = await parseWithZod(formData, {
    schema: (intent) =>
      createSchema(intent, {
        async isEmailUnique(email) {
          await setTimeout(1000)
          return email === 'test@example.com'
        },
      }),
    async: true,
  })

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

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

function ValidationIndicator({
  isValidating,
  errors,
}: {
  isValidating: boolean
  errors: string[] | undefined
}) {
  const hasErrors = errors && errors.length > 0
  const isValid = !isValidating && !hasErrors

  return (
    <div
      className={cn(
        'flex h-6 w-auto min-w-6 items-center justify-center rounded-full transition-all duration-200',
        isValid && 'bg-green-100',
        hasErrors && 'bg-red-100',
        isValidating && 'bg-transparent',
      )}
    >
      {isValidating ? (
        <HStack className="whitespace-nowrap">
          <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          <div className="text-muted-foreground text-xs">確認中</div>
        </HStack>
      ) : isValid ? (
        <CheckIcon className="size-4 text-green-800" />
      ) : hasErrors ? (
        <XIcon className="size-4 text-red-800" />
      ) : (
        <div className="h-2 w-2 rounded-full bg-gray-300" />
      )}
    </div>
  )
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const [form, { email }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, {
        schema: (intent) => createSchema(intent),
      }),
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
  })
  const navigation = useNavigation()
  const isNavigating = navigation.state !== 'idle'
  const intentValue = navigation.formData?.get('__intent__')
  const isAsyncValidating =
    isNavigating &&
    !!intentValue &&
    String(intentValue).includes('"type":"validate"')
  const isSubmitting = isNavigating && !isAsyncValidating

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
              data-1p-ignore
            />
            <ValidationIndicator
              isValidating={isAsyncValidating}
              errors={email.errors}
            />
          </HStack>

          <div className="text-sm text-red-500">{email.errors}</div>
        </Stack>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!form.valid || !form.dirty || isSubmitting}
        >
          Submit
        </Button>
      </Stack>
    </Form>
  )
}
