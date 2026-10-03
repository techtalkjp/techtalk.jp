import { createRedirectResponse } from 'remix/response/redirect'
import { createController } from 'remix/router'

import { submitContact } from '../contact/submit.ts'
import { createI18n, parseLocale } from '../i18n/index.ts'
import { routes } from '../routes.ts'
import { langParam } from '../ui/home/contact.tsx'
import { HomePage } from '../ui/home/page.tsx'
import { ContactFormFragment } from './contact-form.tsx'
import { publicPageHeaders } from './cache.ts'
import { notFound } from './not-found.tsx'

export const home = createController(routes.home, {
  actions: {
    index(context) {
      let locale = parseLocale(context.params.lang)
      if (!locale) return notFound(context)

      let sent = context.url.searchParams.get('sent') === '1'
      return context.render(
        <HomePage i18n={createI18n(locale)} sent={sent} />,
        {
          headers: sent ? undefined : publicPageHeaders,
        },
      )
    },

    /** 問い合わせの送信 */
    async action(context) {
      let locale = parseLocale(context.params.lang)
      if (!locale) return notFound(context)

      let i18n = createI18n(locale)
      let result = await submitContact({
        formData: context.formData,
        locale,
        t: i18n.t,
        workflow: context.bindings.contactWorkflow,
      })
      let status =
        result.status === 'sent' ? 200 : result.status === 'invalid' ? 400 : 503

      // JS あり: フォームの Frame だけを描き直す
      if (context.request.headers.get('X-Remix-Frame') === 'true') {
        return context.render(
          <ContactFormFragment i18n={i18n} state={result} />,
          { status },
        )
      }

      // JS なし: 成功したらリダイレクト、失敗したらページ全体をエラー付きで描く
      if (result.status === 'sent') {
        let href = routes.home.index.href({ ...langParam(locale) })
        return createRedirectResponse(`${href}?sent=1#contact`, 303)
      }
      return context.render(<HomePage i18n={i18n} contactState={result} />, {
        status,
      })
    },
  },
})
