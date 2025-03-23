// app/routes/wizard.tsx
import { data, Outlet, redirect } from 'react-router'
import type { Route } from './+types/_layout'
import { getWizardState } from './_shared/storage.client'
// サーバー側のローダー
export const loader = () => {
  return data({ status: 'ok' })
}

// クライアント側のローダー
export const clientLoader = ({ request }: Route.ClientLoaderArgs) => {
  const url = new URL(request.url)

  // ルートパスへのアクセスをリダイレクト
  if (
    url.pathname === '/demo/conform/wizard' ||
    url.pathname === '/demo/conform/wizard/'
  ) {
    const wizardState = getWizardState()
    const currentStep = wizardState.currentStep || 'step1'

    throw redirect(`/demo/conform/wizard/${currentStep}`)
  }

  return {}
}
clientLoader.hydrate = true

export default function WizardLayout() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <h3 className="text-2xl font-bold">マルチステップフォーム</h3>
        <p className="text-sm text-gray-500">
          状態はブラウザのLocalStorageに保存されます
        </p>
      </div>

      <Outlet />
    </div>
  )
}
