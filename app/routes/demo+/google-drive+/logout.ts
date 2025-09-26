import { href, redirect } from 'react-router'
import { clearSessionAuth } from '~/routes/demo+/google-drive+/_shared/services/google-oauth.server'
import type { Route } from './+types/logout'
import { destroySession, getSession } from './_shared/services/session.server'

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  // トークンを削除
  clearSessionAuth(session)

  // セッションを破棄
  return redirect(href('/demo/google-drive'), {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}
