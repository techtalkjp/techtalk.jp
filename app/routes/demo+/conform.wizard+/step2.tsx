// app/routes/wizard.step2.tsx
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { Form, redirect } from 'react-router'
import type { Route } from './+types/step2'
import { step2Schema } from './_shared/schema'
import { updateWizardState, validateStepAccess } from './_shared/storage.client'

// クライアント側のローダー - ローカルストレージから状態を読み込む
export const clientLoader = () => {
  const { isAllowed, wizardState } = validateStepAccess('step2')

  if (!isAllowed) {
    throw redirect('/demo/conform/wizard/step1')
  }

  return {
    step2Data: wizardState.step2Data || undefined,
    isValid: isAllowed,
  }
}
clientLoader.hydrate = true

// クライアント側のアクション - ローカルストレージに保存
export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formData = await request.formData()
  const intent = formData.get('intent')

  // 「戻る」ボタンがクリックされた場合
  if (intent === 'back') {
    updateWizardState({ currentStep: 'step1' })
    return { success: true }
  }

  const submission = parseWithZod(formData, { schema: step2Schema })

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // ウィザードの状態を更新して次のステップへ
  updateWizardState({
    currentStep: 'step3',
    step2Data: submission.value,
  })

  return redirect('/demo/conform/wizard/step3')
}

export default function Step2Route({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { step2Data } = loaderData
  const lastResult = actionData?.lastResult

  // Conformを使ったフォーム管理
  const [form, fields] = useForm({
    constraint: getZodConstraint(step2Schema),
    defaultValue: step2Data,
    lastResult: lastResult,
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
