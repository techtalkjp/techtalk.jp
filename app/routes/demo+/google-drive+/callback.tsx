import { data, redirect } from 'react-router'
import {
  exchangeCodeForTokens,
  getGoogleUser,
  saveSessionTokens,
} from '~/routes/demo+/google-drive+/_shared/services/google-oauth.server'
import {
  commitSession,
  getSession,
} from '~/routes/demo+/google-drive+/_shared/services/session.server'
import type { Route } from './+types/callback'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  // エラーチェック
  if (error) {
    return data({ error: `OAuth error: ${error}` }, { status: 400 })
  }

  if (!code) {
    return data({ error: 'No authorization code provided' }, { status: 400 })
  }

  const session = await getSession(request.headers.get('Cookie'))

  const savedState = session.get('oauth_state')
  const storedReturnTo = session.get('returnTo')
  const returnTo =
    typeof storedReturnTo === 'string' &&
    storedReturnTo.startsWith('/') &&
    !storedReturnTo.startsWith('//')
      ? storedReturnTo
      : '/demo/google-drive'

  // CSRF対策: stateパラメータの検証
  if (state !== savedState) {
    return data({ error: 'Invalid state parameter' }, { status: 400 })
  }

  try {
    // 認可コードをトークンに交換
    const tokens = await exchangeCodeForTokens(code, url.origin)

    // ユーザー情報を取得
    const user = await getGoogleUser(tokens.access_token)

    // トークンをセッションに保存
    saveSessionTokens(session, tokens)

    // ユーザー情報をセッションに保存
    session.set('google_user', user)
    session.unset('oauth_state')
    session.unset('returnTo')

    return redirect(returnTo, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (_error) {
    session.unset('oauth_state')
    session.unset('returnTo')
    return data(
      { error: 'Failed to authenticate with Google' },
      {
        status: 500,
        headers: { 'Set-Cookie': await commitSession(session) },
      },
    )
  }
}

export default function OAuthCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">認証処理中...</h1>
        <p className="mt-2 text-gray-600">しばらくお待ちください</p>
      </div>
    </div>
  )
}
