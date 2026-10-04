import type { Handle } from 'remix/component'

import type { ContactFormData } from '../types.ts'
import { EmailLayout, styles } from './layout.tsx'

export const contactReplySubject = (locale: string) =>
  locale === 'ja'
    ? 'お問い合わせありがとうございます - TechTalk'
    : 'Thank you for contacting us - TechTalk'

// 宛先は送信者が入力したアドレスなので、他人宛てに任意の文面を送る踏み台にならないよう、
// 名前や本文など入力された内容は載せない
export function ContactReplyEmail(handle: Handle<{ data: ContactFormData }>) {
  return () => {
    let { data } = handle.props
    let ja = data.locale === 'ja'
    return (
      <EmailLayout
        lang={ja ? 'ja' : 'en'}
        preview={contactReplySubject(data.locale)}
      >
        <h1 style={styles.h1}>
          {ja
            ? 'お問い合わせありがとうございます'
            : 'Thank You for Reaching Out'}
        </h1>

        {ja ? (
          <p style={styles.paragraph}>
            この度はお問い合わせいただき、誠にありがとうございます。
            <br />
            内容を確認のうえ、代表の溝口から改めてご連絡いたします。
          </p>
        ) : (
          <p style={styles.paragraph}>
            Thank you for contacting us. Coji Mizoguchi, our founder, will
            review your message and get back to you.
          </p>
        )}

        <hr style={styles.hr} />

        <p style={styles.footer}>
          {ja
            ? 'このメールはお問い合わせの確認として自動送信されています。'
            : 'This email was sent automatically to confirm your inquiry.'}
        </p>
        <p style={styles.footer}>TechTalk Inc.</p>
      </EmailLayout>
    )
  }
}
