// app/routes/wizard.tsx
import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router'
import { getWizardState } from './_shared/storage.client'

export default function WizardLayout() {
  const navigate = useNavigate()

  // クライアントサイドでの初期化とリダイレクト
  useEffect(() => {
    const pathname = window.location.pathname
    
    // ルートパスへのアクセスをリダイレクト
    if (pathname === '/demo/conform/wizard' || pathname === '/demo/conform/wizard/') {
      const wizardState = getWizardState()
      const currentStep = wizardState.currentStep || 'step1'
      
      navigate(`/demo/conform/wizard/${currentStep}`)
    }
  }, [navigate])

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <h3 className="text-2xl font-bold">マルチステップフォーム (LocalStorage版)</h3>
        <p className="text-sm text-gray-500">全ての状態はブラウザのLocalStorageに保存されます</p>
      </div>

      <Outlet />
    </div>
  )
}
