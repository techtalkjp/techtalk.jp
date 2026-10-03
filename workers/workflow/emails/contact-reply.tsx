import type { Handle } from 'remix/component'

import type { ContactFormData } from '../types.ts'
import { EmailLayout, styles } from './layout.tsx'

export const contactReplySubject = (locale: string) =>
  locale === 'ja'
    ? 'お問い合わせありがとうございます - TechTalk'
    : 'Thank you for contacting us - TechTalk'

const quotedMessage = {
  ...styles.message,
  color: '#555',
  fontSize: '14px',
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '4px',
}

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
            {data.name} 様
            <br />
            <br />
            この度はお問い合わせいただき、誠にありがとうございます。
            <br />
            内容を確認の上、担当者より改めてご連絡させていただきます。
          </p>
        ) : (
          <p style={styles.paragraph}>
            Dear {data.name},
            <br />
            <br />
            Thank you for contacting us. We have received your message and will
            get back to you shortly.
          </p>
        )}

        <hr style={styles.hr} />

        <p style={styles.label}>{ja ? 'お問い合わせ内容' : 'Your Message'}</p>
        <p style={quotedMessage}>{data.message}</p>

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
