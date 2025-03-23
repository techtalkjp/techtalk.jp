import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import {
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
  useActionData,
  useLoaderData,
} from 'react-router'
import { step1Schema } from './_shared/schema'
import { getWizardState, updateWizardState } from './_shared/session.server'

// ローダー関数
export async function loader({ request }: LoaderFunctionArgs) {
  const wizardState = await getWizardState(request)

  return {
    step1Data: wizardState.step1Data,
  }
}

// アクション関数
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  // Conformを使ってフォームデータをバリデーション
  const submission = parseWithZod(formData, {
    schema: step1Schema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // ウィザードの状態を更新して次のステップへリダイレクト
  return updateWizardState(
    request,
    {
      currentStep: 'step2',
      step1Data: submission.value,
    },
    '/demo/conform/wizard/step2',
  )
}

export default function Step1Route() {
  const { step1Data } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const [form, fields] = useForm({
    // constraint: getZodConstraint(step1Schema),
    defaultValue: step1Data,
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: step1Schema }),
  })

  return (
    <div className="wizard-step">
      <h1>Step 1: 基本情報</h1>

      <Form method="post" {...getFormProps(form)}>
        <div className="form-field">
          <label htmlFor={fields.name.id}>名前:</label>
          <input
            {...getInputProps(fields.name, { type: 'text' })}
            placeholder="山田 太郎"
          />
          {fields.name.errors && (
            <div className="error">{fields.name.errors}</div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={fields.email.id}>メールアドレス:</label>
          <input
            {...getInputProps(fields.email, { type: 'email' })}
            placeholder="example@example.com"
          />
          {fields.email.errors && (
            <div className="error">{fields.email.errors}</div>
          )}
        </div>

        <div className="button-container">
          <button type="submit">次へ</button>
        </div>
      </Form>
    </div>
  )
}
