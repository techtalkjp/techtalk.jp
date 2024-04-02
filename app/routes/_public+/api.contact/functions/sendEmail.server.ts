import { ResultAsync } from 'neverthrow'
import type { ContactFormData } from '../route'

const sendEmailImpl = async (form: ContactFormData) => {
  const sendForm = { ...form }
  sendForm.message = sendForm.message.replace(/\r\n/g, '<br />')
  sendForm.message = sendForm.message.replace(/(\n|\r)/g, '<br />')

  const payload = {
    personalizations: [
      {
        to: [{ email: sendForm.email }],
        dynamic_template_data: sendForm,
      },
    ],
    subject: "Let's Talk",
    from: { email: 'info@techtalk.jp', name: 'TechTalk' },
    bcc: 'info@techtalk.jp',
    replyTo: 'info@techtalk.jp',
    template_id: 'd-fc1f4a74b71644c0930a8df488956323',
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Failed to send email')
  }
  return await response.text()
}

export const sendEmail = async (form: ContactFormData) => {
  return ResultAsync.fromPromise(sendEmailImpl(form), (e) => {
    console.error(e)
    return e
  })
}
