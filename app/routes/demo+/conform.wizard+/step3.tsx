import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { Form, useActionData, useLoaderData } from 'react-router'
import { step3Schema } from './_shared/schema'
import { requireValidStep, updateWizardState } from './_shared/session.server'

// ローダー関数
export async function loader({ request }: LoaderFunctionArgs) {
  // 前のステップが完了していることを確認
  const wizardState = await requireValidStep(request, 'step3')

  return {
    step1Data: wizardState.step1Data,
    step2Data: wizardState.step2Data,
    step3Data: wizardState.step3Data,
  }
}

// アクション関数
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')

  // 「戻る」ボタンがクリックされた場合
  if (intent === 'back') {
    return updateWizardState(
      request,
      { currentStep: 'step2' },
      '/demo/conform/wizard/step2',
    )
  }

  // 特定のステップに戻る場合
  if (intent === 'goto_step1') {
    return updateWizardState(
      request,
      { currentStep: 'step1' },
      '/demo/conform/wizard/step1',
    )
  }

  if (intent === 'goto_step2') {
    return updateWizardState(
      request,
      { currentStep: 'step2' },
      '/demo/conform/wizard/step2',
    )
  }

  // Conformを使ってフォームデータをバリデーション
  const submission = parseWithZod(formData, {
    schema: step3Schema,
  })

  // バリデーションエラーがある場合
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // フォーム送信確定の場合
  if (intent === 'submit') {
    // ウィザードの状態を更新
    await updateWizardState(request, {
      currentStep: 'complete',
      step3Data: submission.value,
    })

    // ここでデータベースへの保存など最終処理を行う
    // 例: await saveFormDataToDatabase(wizardState);

    return updateWizardState(
      request,
      { currentStep: 'complete' },
      '/demo/conform/wizard/complete',
    )
  }

  // デフォルト: ステップ3のデータだけ更新
  return updateWizardState(request, {
    step3Data: submission.value,
  })
}

export default function Step3Route() {
  const { step1Data, step2Data, step3Data } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  // Conformを使ったフォーム管理
  const [form, fields] = useForm({
    defaultValue: step3Data,
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: step3Schema }),
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
