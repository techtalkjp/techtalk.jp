import type { Handle } from 'remix/component'
import { createAction } from 'remix/router'

import type { I18n } from '../i18n/index.ts'
import { I18nProvider } from '../i18n/provider.tsx'
import { routes } from '../routes.ts'
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

export const contactForm = createAction(routes.contactForm, {
  middleware: [locale()],
  handler(context) {
    let { i18n } = context
    let state: ContactFormState =
      context.url.searchParams.get('sent') === '1'
        ? { status: 'sent' }
        : { status: 'idle' }
    // 単体で開かれても検索結果に出さない
    return context.render(<ContactFormFragment i18n={i18n} state={state} />, {
      headers: { 'X-Robots-Tag': 'noindex' },
    })
  },
})
