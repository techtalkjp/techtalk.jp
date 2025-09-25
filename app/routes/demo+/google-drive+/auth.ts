import { redirect } from 'react-router'
import { getGoogleOAuthURL } from '~/routes/demo+/google-drive+/_shared/services/google-oauth.server'
import {
  commitSession,
  getSession,
} from '~/routes/demo+/google-drive+/_shared/services/session.server'
import type { Route } from './+types/auth'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const returnTo = url.searchParams.get('returnTo') || '/demo/google-drive'

  // セッションにreturnTo URLを保存
  const session = await getSession(request.headers.get('Cookie'))
  session.set('returnTo', returnTo)

  // CSRF対策用のstateパラメータを生成
  const state = crypto.randomUUID()
  session.set('oauth_state', state)

  const authUrl = getGoogleOAuthURL(url.origin, state)

  return redirect(authUrl, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
