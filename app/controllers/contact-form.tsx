import type { Handle } from 'remix/component'
import type { RenderFunction } from 'remix/middleware/render'
import { createAction } from 'remix/router'

import type { I18n } from '../i18n/index.ts'
import { I18nProvider } from '../i18n/provider.tsx'
import { routes } from '../routes.ts'
import { privateHeaders } from './cache.ts'
import { ContactForm, type ContactFormState } from '../ui/home/contact.tsx'
import { locale } from '../middleware/locale.ts'

/** Frame 用の断片（Document なし） */
export function ContactFormFragment(
  handle: Handle<{ i18n: I18n; state: ContactFormState }>,
) {
  return () => (
    <I18nProvider value={handle.props.i18n}>
      <ContactForm state={handle.props.state} />
    </I18nProvider>
  )
}

/**
 * 問い合わせフォームの Frame 用の応答。訪問者ごとに変わるので保存させず、
 * 単体で開かれても検索結果に出さない
 */
export function renderContactFragment(
  context: { render: RenderFunction },
  i18n: I18n,
  state: ContactFormState,
  status = 200,
): Response {
  return context.render(<ContactFormFragment i18n={i18n} state={state} />, {
    status,
    headers: { ...privateHeaders, 'X-Robots-Tag': 'noindex' },
  })
}

/** `?sent=1` のときは送信完了の表示、それ以外は空のフォーム */
export function contactStateFromUrl(url: URL): ContactFormState {
  return url.searchParams.get('sent') === '1'
    ? { status: 'sent' }
    : { status: 'idle' }
}

export const contactForm = createAction(routes.contactForm, {
  middleware: [locale()],
  handler: (context) =>
    renderContactFragment(
      context,
      context.i18n,
      contactStateFromUrl(context.url),
    ),
})
