// app/utils/session.server.ts
import { createCookieSessionStorage, redirect } from 'react-router'
import type { WizardState, WizardStep } from './schema'

// セッションストレージの設定
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__wizard_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['s3cr3t'], // 本番環境では環境変数から取得すべき
    secure: process.env.NODE_ENV === 'production',
  },
})

const WIZARD_KEY = 'wizardState'

// セッションからウィザードの状態を取得
export async function getWizardState(request: Request): Promise<WizardState> {
  const session = await getSession(request)
  const state = session.get(WIZARD_KEY) as WizardState | undefined

  if (!state) {
    // 初期状態
    return { currentStep: 'step1' }
  }

  return state
}

// ウィザードの状態を更新
export async function updateWizardState(
  request: Request,
  updatedState: Partial<WizardState>,
  redirectTo?: string,
): Promise<Response> {
  const session = await getSession(request)
  const currentState = (session.get(WIZARD_KEY) as WizardState | undefined) || {
    currentStep: 'step1',
  }

  // 現在の状態と更新を結合
  const newState: WizardState = {
    ...currentState,
    ...updatedState,
  }

  session.set(WIZARD_KEY, newState)

  const headers = {
    'Set-Cookie': await sessionStorage.commitSession(session),
  }

  if (redirectTo) {
    return redirect(redirectTo, { headers })
  }

  return new Response(null, { headers })
}

// ウィザード状態をリセット
export async function resetWizardState(request: Request): Promise<Response> {
  const session = await getSession(request)
  session.unset(WIZARD_KEY)

  return redirect('/demo/conform/wizard/step1', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  })
}

// リクエストからセッションを取得するヘルパー
async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return await sessionStorage.getSession(cookie)
}

// ステップアクセスを検証するヘルパー
export async function validateStepAccess(
  request: Request,
  requiredStep: WizardStep,
): Promise<{ isAllowed: boolean; wizardState: WizardState }> {
  const wizardState = await getWizardState(request)
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

// 特定のステップを取得し、不正なアクセスの場合はリダイレクト
export async function requireValidStep(
  request: Request,
  requiredStep: WizardStep,
): Promise<WizardState> {
  const { isAllowed, wizardState } = await validateStepAccess(
    request,
    requiredStep,
  )

  if (!isAllowed) {
    let redirectToStep: WizardStep = 'step1'

    // 可能な限り直近の完了したステップに戻す
    if (requiredStep === 'step3' && wizardState.step1Data) {
      redirectToStep = 'step2'
    } else if (requiredStep === 'complete' && wizardState.step2Data) {
      redirectToStep = 'step3'
    }

    throw redirect(`/demo/conform/wizard/${redirectToStep}`)
  }

  return wizardState
}
