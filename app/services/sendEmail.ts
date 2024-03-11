import type { ContactFormData } from '~/routes/_public+/api.contact'

export const sendEmail = async (form: ContactFormData) => {
  const sendForm = { ...form }
  if (sendForm.message) {
    sendForm.message = sendForm.message.replace(/\r\n/g, '<br />')
    sendForm.message = sendForm.message.replace(/(\n|\r)/g, '<br />')
  }

  const payload = {
    to: sendForm.email,
    from: {
      email: 'info@techtalk.jp',
      name: 'TechTalk',
    },
    bcc: 'info@techtalk.jp',
    replyTo: 'info@techtalk.jp',
    dynamicTemplateData: sendForm,
    templateId: 'd-fc1f4a74b71644c0930a8df488956323',
  }

  return await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })
}
