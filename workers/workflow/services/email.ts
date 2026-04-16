import { render } from '@react-email/render'
import { EmailMessage } from 'cloudflare:email'
import { createMimeMessage } from 'mimetext'
import { err, ok } from 'neverthrow'
import { ContactNotificationEmail } from '../emails/contact-notification'
import { ContactReplyEmail } from '../emails/contact-reply'
import type { ContactFormData } from '../types'

const FROM_ADDRESS = 'info@techtalk.jp'
const FROM_NAME = 'TechTalk'

const buildEmailMessage = (params: {
  from: string
  fromName: string
  to: string
  subject: string
  html: string
}) => {
  const msg = createMimeMessage()
  msg.setSender({ name: params.fromName, addr: params.from })
  msg.setRecipient(params.to)
  msg.setSubject(params.subject)
  msg.addMessage({ contentType: 'text/html', data: params.html })
  return new EmailMessage(params.from, params.to, msg.asRaw())
}

export const sendNotificationEmail = async (
  emailBinding: SendEmail,
  form: ContactFormData,
) => {
  try {
    const html = await render(ContactNotificationEmail({ data: form }))
    const message = buildEmailMessage({
      from: FROM_ADDRESS,
      fromName: FROM_NAME,
      to: FROM_ADDRESS,
      subject: `新しいお問い合わせ: ${form.name}様`,
      html,
    })
    await emailBinding.send(message)
    return ok()
  } catch (error) {
    return err(`Notification email failed: ${error}`)
  }
}

export const sendReplyEmail = async (
  emailBinding: SendEmail,
  form: ContactFormData,
) => {
  try {
    const html = await render(ContactReplyEmail({ data: form }))
    const isJapanese = form.locale === 'ja'
    const message = buildEmailMessage({
      from: FROM_ADDRESS,
      fromName: FROM_NAME,
      to: form.email,
      subject: isJapanese
        ? 'お問い合わせありがとうございます - TechTalk'
        : 'Thank you for contacting us - TechTalk',
      html,
    })
    await emailBinding.send(message)
    return ok()
  } catch (error) {
    return err(`Reply email failed: ${error}`)
  }
}
