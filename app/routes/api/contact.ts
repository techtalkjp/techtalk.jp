import sgMail from '@sendgrid/mail'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
//import * as Slack from 'typed-slack'
import type { ContactFormData } from '~/interfaces/ContactFormData'

const sendEmail = async (form: ContactFormData) => {
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

// const sendSlack = async (form: ContactFormData) => {
//   const slack = new Slack.IncomingWebhook(process.env.SLACK_WEBHOOK as string)
//   await slack.send({ text: JSON.stringify(form) })
// }

function isValidFormData(form: FormData) {
  return !!form.has('email')
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  if (request.method !== 'POST' || !isValidFormData(formData)) {
    throw json(
      {
        error: {
          code: 'error',
          message: 'The requested form data is not valid'
        }
      },
      { status: 500 }
    )
  }

  return {}
  //  await sendEmail(formData)

  /*
  try {
    await sendSlack(formData)
    await sendEmail(formData)
    return res.status(200).end()
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'error',
        message: error.toString()
      }
    })
  }
  */
}
