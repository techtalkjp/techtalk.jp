import sgMail from '@sendgrid/mail'
import type { ContactFormData } from '../interfaces/ContactFormData'

export const sendEmail = async (form: ContactFormData) => {
  if (form.message) {
    form.message = form.message.replace(/\r\n/g, '<br />')
    form.message = form.message.replace(/(\n|\r)/g, '<br />')
  }

  const payload: sgMail.MailDataRequired = {
    to: form.email,
    from: {
      email: 'info@techtalk.jp',
      name: 'TechTalk'
    },
    bcc: 'info@techtalk.jp',
    replyTo: 'info@techtalk.jp',
    dynamicTemplateData: form,
    templateId: 'd-fc1f4a74b71644c0930a8df488956323'
    //    mailSettings: { sandboxMode: { enable: true } }
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
  await sgMail.send(payload)
}
