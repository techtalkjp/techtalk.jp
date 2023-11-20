import type { ContactFormData } from '~/pages/contact.ts'

export const sendEmail = async (form: ContactFormData) => {
  const sendForm = { ...form }
  if (sendForm.message) {
    sendForm.message = sendForm.message.replace(/\r\n/g, '<br />')
    sendForm.message = sendForm.message.replace(/(\n|\r)/g, '<br />')
  }

  const payload = {
    personalizations: [
      {
        to: [{ email: sendForm.email, name: sendForm.name }],
        bcc: [{ email: 'info@techtalk.jp' }],
        dynamic_template_data: sendForm,
      },
    ],
    from: { email: 'info@techtalk.jp', name: 'TechTalk' },
    reply_to: { email: 'info@techtalk.jp', name: 'TechTalk' },
    template_id: 'd-fc1f4a74b71644c0930a8df488956323',
  }

  return await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })
}