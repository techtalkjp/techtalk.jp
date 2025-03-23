// app/routes/wizard.complete.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { Form, useLoaderData } from 'react-router'
import { requireValidStep, resetWizardState } from './_shared/session.server'

// ローダー関数
export async function loader({ request }: LoaderFunctionArgs) {
  // 全てのステップが完了していることを確認
  const wizardState = await requireValidStep(request, 'complete')

  return {
    formData: {
      step1: wizardState.step1Data,
      step2: wizardState.step2Data,
      step3: wizardState.step3Data,
    },
  }
}

// アクション関数
export async function action({ request }: ActionFunctionArgs) {
  // 新しいフォームを開始
  return await resetWizardState(request)
}

export default function CompleteRoute() {
  const { formData } = useLoaderData<typeof loader>()

  return (
    <div className="wizard-complete">
      <h1>フォーム送信完了</h1>

      <div className="success-message">
        <p>
          送信いただきありがとうございます。以下の情報が正常に送信されました。
        </p>
      </div>

      <div className="summary">
        <h2>送信内容</h2>

        <div className="summary-section">
          <h3>個人情報</h3>
          <p>
            <strong>名前:</strong> {formData.step1?.name}
          </p>
          <p>
            <strong>メールアドレス:</strong> {formData.step1?.email}
          </p>
        </div>

        <div className="summary-section">
          <h3>住所情報</h3>
          <p>
            <strong>住所:</strong> {formData.step2?.address}
          </p>
          <p>
            <strong>市区町村:</strong> {formData.step2?.city}
          </p>
          <p>
            <strong>郵便番号:</strong> {formData.step2?.postalCode}
          </p>
        </div>

        <div className="summary-section">
          <h3>追加情報</h3>
          <p>
            <strong>コメント:</strong> {formData.step3?.comments || 'なし'}
          </p>
        </div>
      </div>

      <Form method="post">
        <button type="submit">新しいフォームを開始</button>
      </Form>
    </div>
  )
}
