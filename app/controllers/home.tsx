import { createRedirectResponse } from 'remix/response/redirect'
import { createController } from 'remix/router'

import { submitContact } from '../contact/submit.ts'
import { paths } from '../paths.ts'
import { routes } from '../routes.ts'
import { CONTACT_FRAME } from '../ui/home/contact.tsx'
import { HomePage } from '../ui/home/page.tsx'
import { publicPageHeaders } from './cache.ts'
import { ContactFormFragment } from './contact-form.tsx'
import { locale } from '../middleware/locale.ts'

export const home = createController(routes.home, {
  middleware: [locale()],
  actions: {
    index(context) {
      let { i18n } = context
      let sent = context.url.searchParams.get('sent') === '1'
      return context.render(<HomePage i18n={i18n} sent={sent} />, {
        headers: sent ? undefined : publicPageHeaders,
      })
    },

    /** 問い合わせの送信 */
    async action(context) {
      let { i18n } = context
      let result = await submitContact({
        formData: context.formData,
        locale: i18n.locale,
        t: i18n.t,
        workflow: context.bindings.contactWorkflow,
      })

      // JS あり: 問い合わせフォームの Frame だけを描き直す。
      // ブラウザの Frame は 5xx を捨てるので、送信失敗も 200 で返してメッセージを見せる
      if (context.request.headers.get('X-Remix-Target') === CONTACT_FRAME) {
        let status = result.status === 'invalid' ? 400 : 200
        return context.render(
          <ContactFormFragment i18n={i18n} state={result} />,
          { status },
        )
      }

      // JS なし: 成功したらリダイレクト、失敗したらページ全体をエラー付きで描く
      if (result.status === 'sent') {
        return createRedirectResponse(
          `${paths.home(i18n.locale)}?sent=1#contact`,
          303,
        )
      }
      let status = result.status === 'invalid' ? 400 : 503
      return context.render(<HomePage i18n={i18n} contactState={result} />, {
        status,
      })
    },
  },
})
