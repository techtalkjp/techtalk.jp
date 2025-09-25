import { redirect } from 'react-router'
import { deleteSessionTokens } from '~/routes/demo+/google-drive+/_shared/services/google-oauth.server'
import {
  destroySession,
  getSession,
} from '~/routes/demo+/google-drive+/_shared/services/session.server'
import type { Route } from './+types/logout'

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  // トークンを削除
  deleteSessionTokens(session)

  // セッションを破棄
  return redirect('/demo/google-drive', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}
