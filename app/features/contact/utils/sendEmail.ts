import sgMail from '@sendgrid/mail'
import type { ContactFormData } from '../interfaces/ContactFormData'

export const sendEmail = async (form: ContactFormData) => {
  if (form.message) {
    form.message = form.message.replace(/\r\n/g, '<br />')
    form.message = form.message.replace(/(\n|\r)/g, '<br />')
  }

  const payload = {
    to: form.email,
    from: {
      email: 'info@techtalk.jp',
      name: 'TechTalk'
    },
    bcc: 'info@techtalk.jp',
    replyTo: 'info@techtalk.jp',
    dynamic_template_data: form,
    template_id: 'd-fc1f4a74b71644c0930a8df488956323'
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
  await sgMail.send(payload as any)
}
