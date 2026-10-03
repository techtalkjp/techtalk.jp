import { createRedirectResponse } from 'remix/response/redirect'
import { createController } from 'remix/router'

import { submitContact } from '../contact/submit.ts'
import { contactFormData } from '../middleware/contact-form-data.ts'
import { locale } from '../middleware/locale.ts'
import { paths } from '../paths.ts'
import { routes } from '../routes.ts'
import { HomePage } from '../ui/home/page.tsx'
import { privateHeaders, publicPageHeaders } from './cache.ts'
import { contactStateFromUrl } from './contact-form.tsx'

export const home = createController(routes.home, {
  middleware: [locale(), contactFormData()],
  actions: {
    index(context) {
      let sent = contactStateFromUrl(context.url).status === 'sent'
      return context.render(<HomePage i18n={context.i18n} sent={sent} />, {
        headers: sent ? privateHeaders : publicPageHeaders,
      })
    },

    /**
     * JS なしで問い合わせを送ったとき。成功したらリダイレクト、
     * 失敗したらページ全体をエラー付きで描く（JS ありの送信は contactForm が受ける）
     */
    async action(context) {
      let { i18n } = context
      let result = await submitContact({
        formData: context.formData,
        locale: i18n.locale,
        t: i18n.t,
        workflow: context.bindings.contactWorkflow,
      })
      if (result.status === 'sent') {
        return createRedirectResponse(
          `${paths.home(i18n.locale)}?sent=1#contact`,
          303,
        )
      }
      let status = result.status === 'invalid' ? 400 : 503
      return context.render(<HomePage i18n={i18n} contactState={result} />, {
        status,
        headers: privateHeaders,
      })
    },
  },
})
