// app/routes/wizard.step2.tsx
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { Form, useActionData, useLoaderData } from 'react-router'
import { step2Schema } from './_shared/schema'
import { requireValidStep, updateWizardState } from './_shared/session.server'

// ローダー関数
export async function loader({ request }: LoaderFunctionArgs) {
  // ステップ1が完了していることを確認し、そうでなければリダイレクト
  const wizardState = await requireValidStep(request, 'step2')

  return {
    step2Data: wizardState.step2Data,
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
      { currentStep: 'step1' },
      '/demo/conform/wizard/step1',
    )
  }

  // Conformを使ってフォームデータをバリデーション
  const submission = parseWithZod(formData, {
    schema: step2Schema,
  })

  // バリデーションエラーがある場合
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // ウィザードの状態を更新して次のステップへリダイレクト
  return updateWizardState(
    request,
    {
      currentStep: 'step3',
      step2Data: submission.value,
    },
    '/demo/conform/wizard/step3',
  )
}

export default function Step2Route() {
  const { step2Data } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  // Conformを使ったフォーム管理
  const [form, fields] = useForm({
    constraint: getZodConstraint(step2Schema),
    defaultValue: step2Data,
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: step2Schema }),
  })

  return (
    <div className="wizard-step">
      <h1>Step 2: 住所情報</h1>

      <Form method="post" {...getFormProps(form)}>
        <div className="form-field">
          <label htmlFor={fields.address.id}>住所:</label>
          <input
            {...getInputProps(fields.address, { type: 'text' })}
            placeholder="東京都千代田区〇〇〇"
          />
          {fields.address.errors && (
            <div className="error">{fields.address.errors}</div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={fields.city.id}>市区町村:</label>
          <input
            {...getInputProps(fields.city, { type: 'text' })}
            placeholder="千代田区"
          />
          {fields.city.errors && (
            <div className="error">{fields.city.errors}</div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={fields.postalCode.id}>郵便番号:</label>
          <input
            {...getInputProps(fields.postalCode, { type: 'text' })}
            placeholder="100-0001"
          />
          {fields.postalCode.errors && (
            <div className="error">{fields.postalCode.errors}</div>
          )}
        </div>

        <div className="button-container">
          <button type="submit" name="intent" value="back">
            戻る
          </button>
          <button type="submit">次へ</button>
        </div>
      </Form>
    </div>
  )
}
