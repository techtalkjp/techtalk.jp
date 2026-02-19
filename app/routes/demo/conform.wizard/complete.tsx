// app/routes/wizard.complete.tsx
import { Form, redirect, useNavigate } from 'react-router'
import type { Route } from './+types/complete'
import { resetWizardState, validateStepAccess } from './_shared/storage.client'

// クライアント側のローダー - ローカルストレージから状態を読み込む
export const clientLoader = () => {
  const { isAllowed, wizardState } = validateStepAccess('complete')

  if (!isAllowed) {
    throw redirect('/demo/conform/wizard/step1')
  }

  return {
    formData: {
      step1: wizardState.step1Data,
      step2: wizardState.step2Data,
      step3: wizardState.step3Data,
    },
    isValid: isAllowed,
  }
}
clientLoader.hydrate = true

// クライアント側のアクション - ローカルストレージに保存
export const clientAction = () => {
  // ウィザードの状態をリセット
  resetWizardState()
  return { success: true }
}

export default function CompleteRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const { formData } = loaderData

  const handleReset = () => {
    resetWizardState()
    navigate('/demo/conform/wizard/step1')
  }

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

      <Form
        method="post"
        onSubmit={(e) => {
          e.preventDefault()
          handleReset()
        }}
      >
        <button type="submit">新しいフォームを開始</button>
      </Form>
    </div>
  )
}
