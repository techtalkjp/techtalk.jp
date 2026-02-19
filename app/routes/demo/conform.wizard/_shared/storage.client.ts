// app/routes/demo+/conform.wizard+/_shared/storage.client.ts
import type { WizardState, WizardStep } from './schema'

const WIZARD_KEY = 'wizardLocalState'

// ローカルストレージからウィザードの状態を取得
export function getWizardState(): WizardState {
  if (typeof window === 'undefined') {
    // サーバーサイドレンダリング中は初期状態を返す
    return { currentStep: 'step1' }
  }

  try {
    const stateString = localStorage.getItem(WIZARD_KEY)
    if (!stateString) {
      // 初期状態
      return { currentStep: 'step1' }
    }

    return JSON.parse(stateString) as WizardState
  } catch (error) {
    console.error('Error retrieving wizard state from localStorage:', error)
    // エラーの場合は初期状態を返す
    return { currentStep: 'step1' }
  }
}

// ウィザードの状態を更新
export function updateWizardState(
  updatedState: Partial<WizardState>,
): WizardState {
  if (typeof window === 'undefined') {
    // サーバーサイドレンダリング中は何もしない
    return { currentStep: 'step1' }
  }

  try {
    // 現在の状態を取得
    const currentState = getWizardState()

    // 現在の状態と更新を結合
    const newState: WizardState = {
      ...currentState,
      ...updatedState,
    }

    // ローカルストレージに保存
    localStorage.setItem(WIZARD_KEY, JSON.stringify(newState))

    return newState
  } catch (error) {
    console.error('Error updating wizard state in localStorage:', error)
    return { currentStep: 'step1' }
  }
}

// ウィザード状態をリセット
export function resetWizardState(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(WIZARD_KEY)
  } catch (error) {
    console.error('Error resetting wizard state in localStorage:', error)
  }
}

// ステップアクセスを検証するヘルパー
export function validateStepAccess(requiredStep: WizardStep): {
  isAllowed: boolean
  wizardState: WizardState
} {
  const wizardState = getWizardState()
  let isAllowed = true

  // ステップへのアクセス制御ロジック
  if (requiredStep === 'step2' && !wizardState.step1Data) {
    isAllowed = false
  } else if (
    requiredStep === 'step3' &&
    (!wizardState.step1Data || !wizardState.step2Data)
  ) {
    isAllowed = false
  } else if (
    requiredStep === 'complete' &&
    (!wizardState.step1Data || !wizardState.step2Data || !wizardState.step3Data)
  ) {
    isAllowed = false
  }

  return { isAllowed, wizardState }
}
