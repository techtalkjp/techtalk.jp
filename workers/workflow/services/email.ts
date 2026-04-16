import { render } from '@react-email/render'
import { EmailMessage } from 'cloudflare:email'
import { createMimeMessage } from 'mimetext'
import { err, ok } from 'neverthrow'
import { ContactNotificationEmail } from '../emails/contact-notification'
import { ContactReplyEmail, contactReplySubject } from '../emails/contact-reply'
import type { ContactFormData } from '../types'

const FROM_ADDRESS = 'info@techtalk.jp'
const FROM_NAME = 'TechTalk'

const sendEmail = async (
  emailBinding: SendEmail,
  to: string,
  subject: string,
  element: React.ReactElement,
) => {
  const html = await render(element)
  const msg = createMimeMessage()
  msg.setSender({ name: FROM_NAME, addr: FROM_ADDRESS })
  msg.setRecipient(to)
  msg.setSubject(subject)
  msg.addMessage({ contentType: 'text/html', data: html })
  await emailBinding.send(new EmailMessage(FROM_ADDRESS, to, msg.asRaw()))
}

export const sendNotificationEmail = async (
  emailBinding: SendEmail,
  form: ContactFormData,
) => {
  try {
    await sendEmail(
      emailBinding,
      FROM_ADDRESS,
      `新しいお問い合わせ: ${form.name}様`,
      ContactNotificationEmail({ data: form }),
    )
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
    await sendEmail(
      emailBinding,
      form.email,
      contactReplySubject(form.locale),
      ContactReplyEmail({ data: form }),
    )
    return ok()
  } catch (error) {
    return err(`Reply email failed: ${error}`)
  }
}
