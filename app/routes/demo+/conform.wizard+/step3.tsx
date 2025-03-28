import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, redirect, useNavigate } from 'react-router'
import type { Route } from './+types/step3'
import { step3Schema } from './_shared/schema'
import { updateWizardState, validateStepAccess } from './_shared/storage.client'

// クライアント側のローダー - ローカルストレージから状態を読み込む
export const clientLoader = () => {
  const { isAllowed, wizardState } = validateStepAccess('step3')

  if (!isAllowed) {
    throw redirect('/demo/conform/wizard/step1')
  }

  return {
    step1Data: wizardState.step1Data || undefined,
    step2Data: wizardState.step2Data || undefined,
    step3Data: wizardState.step3Data || undefined,
    isValid: isAllowed,
  }
}
clientLoader.hydrate = true

// サーバー側のアクション - フォールバック処理
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')

  // 「戻る」ボタンがクリックされた場合
  if (intent === 'back') {
    return redirect('/demo/conform/wizard/step2')
  }

  // 特定のステップに戻る場合
  if (intent === 'goto_step1') {
    return redirect('/demo/conform/wizard/step1')
  }

  if (intent === 'goto_step2') {
    return redirect('/demo/conform/wizard/step2')
  }

  // Conformを使ってフォームデータをバリデーション
  const submission = parseWithZod(formData, {
    schema: step3Schema,
  })

  // バリデーションエラーがある場合
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // サーバーサイドでのリダイレクト（通常はクライアントアクションが処理）
  return redirect('/demo/conform/wizard/complete')
}

// クライアント側のアクション - ローカルストレージに保存
export const clientAction = async ({
  serverAction,
  request,
}: Route.ClientActionArgs) => {
  const formData = await request.formData()
  const intent = formData.get('intent')

  // 「戻る」ボタンがクリックされた場合
  if (intent === 'back') {
    updateWizardState({ currentStep: 'step2' })
    return { success: true }
  }

  // 特定のステップに戻る場合
  if (intent === 'goto_step1') {
    updateWizardState({ currentStep: 'step1' })
    return { success: true }
  }

  if (intent === 'goto_step2') {
    updateWizardState({ currentStep: 'step2' })
    return { success: true }
  }

  const submission = parseWithZod(formData, { schema: step3Schema })

  if (submission.status !== 'success') {
    // フォームバリデーションエラーはサーバーアクションから返す
    return await serverAction()
  }

  // フォーム送信確定の場合
  if (intent === 'submit') {
    // ウィザードの状態を更新
    updateWizardState({
      currentStep: 'complete',
      step3Data: submission.value,
    })

    return { success: true, lastResult: submission.reply() }
  }

  // デフォルト: ステップ3のデータだけ更新
  updateWizardState({
    step3Data: submission.value,
  })

  return { success: true, lastResult: submission.reply() }
}

export default function Step3Route({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const navigate = useNavigate()
  const { step1Data, step2Data, step3Data } = loaderData
  const lastResult = actionData?.lastResult

  // Conformを使ったフォーム管理
  const [form, fields] = useForm({
    defaultValue: step3Data,
    lastResult: lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: step3Schema }),
    onSubmit: (event) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const intent = formData.get('intent')

      if (intent === 'back') {
        navigate('/demo/conform/wizard/step2')
      } else if (intent === 'goto_step1') {
        navigate('/demo/conform/wizard/step1')
      } else if (intent === 'goto_step2') {
        navigate('/demo/conform/wizard/step2')
      } else if (intent === 'submit') {
        // 送信後、完了ページへナビゲート
        setTimeout(() => {
          navigate('/demo/conform/wizard/complete')
        }, 0)
      }
    },
  })

  return (
    <div className="wizard-step">
      <h1>Step 3: 確認と送信</h1>

      <div className="review-section">
        <h2>
          個人情報
          <button
            type="submit"
            form="step3-form"
            name="intent"
            value="goto_step1"
            className="edit-button"
          >
            編集
          </button>
        </h2>
        <div className="review-data">
          <p>
            <strong>名前:</strong> {step1Data?.name}
          </p>
          <p>
            <strong>メールアドレス:</strong> {step1Data?.email}
          </p>
        </div>
      </div>

      <div className="review-section">
        <h2>
          住所情報
          <button
            type="submit"
            form="step3-form"
            name="intent"
            value="goto_step2"
            className="edit-button"
          >
            編集
          </button>
        </h2>
        <div className="review-data">
          <p>
            <strong>住所:</strong> {step2Data?.address}
          </p>
          <p>
            <strong>市区町村:</strong> {step2Data?.city}
          </p>
          <p>
            <strong>郵便番号:</strong> {step2Data?.postalCode}
          </p>
        </div>
      </div>

      <Form method="post" {...getFormProps(form)}>
        <div className="form-field">
          <label htmlFor={fields.comments.id}>追加コメント (任意):</label>
          <textarea {...getTextareaProps(fields.comments)} rows={4} />
        </div>

        <div className="form-field checkbox">
          <input {...getInputProps(fields.agreement, { type: 'checkbox' })} />
          <label htmlFor={fields.agreement.id}>利用規約に同意します</label>
          {fields.agreement.errors && (
            <div className="error">{fields.agreement.errors}</div>
          )}
        </div>

        <div className="button-container">
          <button type="submit" name="intent" value="back">
            戻る
          </button>
          <button type="submit" name="intent" value="submit">
            送信
          </button>
        </div>
      </Form>
    </div>
  )
}
