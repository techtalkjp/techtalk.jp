import type { ContactFormData } from '~/routes/api.contact'

export const sendEmail = async (form: ContactFormData) => {
  if (form.message) {
    form.message = form.message.replace(/\r\n/g, '<br />')
    form.message = form.message.replace(/(\n|\r)/g, '<br />')
  }

  const payload = {
    to: form.email,
    from: {
      email: 'info@techtalk.jp',
      name: 'TechTalk',
    },
    bcc: 'info@techtalk.jp',
    replyTo: 'info@techtalk.jp',
    dynamicTemplateData: form,
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
