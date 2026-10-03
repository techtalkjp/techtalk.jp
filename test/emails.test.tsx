import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import type { ContactFormData } from '../app/contact/types.ts'
import { ContactNotificationEmail } from '../workers/workflow/emails/contact-notification.tsx'
import {
  ContactReplyEmail,
  contactReplySubject,
} from '../workers/workflow/emails/contact-reply.tsx'

const data: ContactFormData = {
  name: '<b>山田</b>',
  company: '株式会社テスト',
  email: 'yamada@example.com',
  message: '1行目\n2行目',
  privacyPolicy: true,
  locale: 'ja',
}

describe('emails', () => {
  it('renders the notification email with escaped user input', async () => {
    let html = await renderToString(
      <ContactNotificationEmail
        data={data}
        classificationNote="LLM判定: normal"
      />,
    )
    assert.match(html, /新しいお問い合わせ/)
    assert.match(html, /&lt;b&gt;山田&lt;\/b&gt;/)
    assert.doesNotMatch(html, /<b>山田<\/b>/)
    assert.match(html, /株式会社テスト/)
    assert.match(html, /LLM判定: normal/)
    assert.match(html, /white-space:\s*pre-wrap/)
  })

  it('renders the reply email in the inquiry locale', async () => {
    let ja = await renderToString(<ContactReplyEmail data={data} />)
    assert.match(ja, /この度はお問い合わせいただき/)
    // 第三者宛ての踏み台にならないよう、入力内容は載せない
    assert.doesNotMatch(ja, /山田|1行目/)
    let en = await renderToString(
      <ContactReplyEmail data={{ ...data, locale: 'en' }} />,
    )
    assert.match(en, /Thank you for contacting us/)
    assert.equal(
      contactReplySubject('en'),
      'Thank you for contacting us - TechTalk',
    )
  })
})
