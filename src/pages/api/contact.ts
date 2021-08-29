import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'
import * as Slack from 'typed-slack'

interface ContactFormData {
  name: string
  company?: string
  phone?: string
  email: string
  message?: string
}

type Data = {
  error?: {
    code: string
    message: string
  }
}

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

const sendSlack = async (form: ContactFormData) => {
  const slack = new Slack.IncomingWebhook(process.env.SLACK_WEBHOOK as string)
  await slack.send({ text: JSON.stringify(form) })
}

function isValidFormData(form: ContactFormData): Boolean {
  if (!form.email) {
    return false
  }
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const formData = req.body as ContactFormData
  if (req.method !== 'POST' || !isValidFormData(formData)) {
    res.status(500).json({
      error: {
        code: 'error',
        message: 'The requested form data is not valid'
      }
    })
    return
  }

  try {
    await sendSlack(formData)
    await sendEmail(formData)
    return res.status(200).end()
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'error',
        message: 'The requested form data is not valid'
      }
    })
  }
}
