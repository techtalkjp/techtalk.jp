import type { Handle } from 'remix/component'
import { createController } from 'remix/router'

import { submitContact } from '../contact/submit.ts'
import type { I18n } from '../i18n/index.ts'
import { I18nProvider } from '../i18n/provider.tsx'
import { contactFormData } from '../middleware/contact-form-data.ts'
import { locale } from '../middleware/locale.ts'
import { routes } from '../routes.ts'
import { ContactForm, type ContactFormState } from '../ui/home/contact.tsx'
import { privateHeaders } from './cache.ts'

/** Frame 用の断片（Document なし） */
function ContactFormFragment(
  handle: Handle<{ i18n: I18n; state: ContactFormState }>,
) {
  return () => (
    <I18nProvider value={handle.props.i18n}>
      <ContactForm state={handle.props.state} />
    </I18nProvider>
  )
}

/** `?sent=1` のときは送信完了の表示、それ以外は空のフォーム */
export function contactStateFromUrl(url: URL): ContactFormState {
  return url.searchParams.get('sent') === '1'
    ? { status: 'sent' }
    : { status: 'idle' }
}

// 訪問者ごとに変わるので保存させず、単体で開かれても検索結果に出さない
const fragmentHeaders = { ...privateHeaders, 'X-Robots-Tag': 'noindex' }

/**
 * トップに埋め込む問い合わせフォームの Frame。JS ありの送信もここで受け、
 * フォーム部分だけを返す（JS なしの送信はトップのページ URL が受ける）。
 */
export const contactForm = createController(routes.contactForm, {
  middleware: [locale(), contactFormData()],
  actions: {
    index(context) {
      let state = contactStateFromUrl(context.url)
      return context.render(
        <ContactFormFragment i18n={context.i18n} state={state} />,
        { headers: fragmentHeaders },
      )
    },

    async action(context) {
      let { i18n } = context
      let result = await submitContact({
        formData: context.formData,
        locale: i18n.locale,
        t: i18n.t,
        workflow: context.bindings.contactWorkflow,
      })
      // ブラウザの Frame は 5xx を捨てるので、送信失敗も 200 で返してメッセージを見せる
      let status = result.status === 'invalid' ? 400 : 200
      return context.render(
        <ContactFormFragment i18n={i18n} state={result} />,
        { status, headers: fragmentHeaders },
      )
    },
  },
})
