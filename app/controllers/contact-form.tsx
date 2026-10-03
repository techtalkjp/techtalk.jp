import type { Handle } from 'remix/component'
import { createAction } from 'remix/router'

import { createI18n, parseLocale, type I18n } from '../i18n/index.ts'
import { I18nProvider } from '../i18n/provider.tsx'
import { routes } from '../routes.ts'
import { ContactForm, type ContactFormState } from '../ui/home/contact.tsx'
import { notFound } from './not-found.tsx'

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

export const contactForm = createAction(routes.contactForm, (context) => {
  let locale = parseLocale(context.params.lang)
  if (!locale) return notFound(context)

  let state: ContactFormState =
    context.url.searchParams.get('sent') === '1'
      ? { status: 'sent' }
      : { status: 'idle' }
  return context.render(
    <ContactFormFragment i18n={createI18n(locale)} state={state} />,
  )
})
