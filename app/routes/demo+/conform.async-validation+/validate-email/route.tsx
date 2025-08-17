import { CheckIcon, XIcon } from 'lucide-react'
import { setTimeout } from 'node:timers/promises'
import { useCallback } from 'react'
import { href, useFetcher } from 'react-router'
import { HStack } from '~/components/ui'
import { cn } from '~/libs/utils'
import type { Route } from './+types/route'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const email = formData.get('email')

  await setTimeout(1000) // 1秒待つ

  if (email !== 'test@example.com') {
    return { isValid: false, message: 'メールアドレスが重複しています' }
  }

  return { isValid: true, message: null }
}

// メールの非同期バリデーションを扱うカスタムフック
export function useEmailAsyncValidation() {
  const fetcher = useFetcher<typeof action>()

  const validateEmail = useCallback(
    (email: string) => {
      if (!email) return

      fetcher.submit(
        { intent: 'email_validate', email },
        {
          method: 'POST',
          action: href('/demo/conform/async-validation/validate-email'),
        },
      )
    },
    [fetcher.submit],
  )

  const isValidating = fetcher.state === 'submitting'
  const isValid = fetcher.data?.isValid
  const errorMessage = isValidating ? null : fetcher.data?.message

  // バリデーション状態を表示するコンポーネント
  const ValidationIndicator = () => {
    return (
      <div
        className={cn(
          'flex h-6 w-auto min-w-6 items-center justify-center rounded-full transition-all duration-200',
          isValid === true && 'bg-green-100',
          isValid === false && 'bg-red-100',
          isValidating && 'bg-transparent',
        )}
      >
        {isValidating ? (
          // ローディングスピナー
          <HStack className="whitespace-nowrap">
            <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            <div className="text-muted-foreground text-xs">確認中</div>
          </HStack>
        ) : isValid === true ? (
          // チェックマーク
          <CheckIcon className="size-4 text-green-800" />
        ) : isValid === false ? (
          // エラー X マーク
          <XIcon className="size-4 text-red-800" />
        ) : (
          // 未検証状態（グレーの円）
          <div className="h-2 w-2 rounded-full bg-gray-300" />
        )}
      </div>
    )
  }

  return {
    isValid,
    errorMessage,
    validateEmail,
    ValidationIndicator,
  }
}
