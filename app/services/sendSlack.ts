import * as Slack from 'typed-slack'
import type { ContactFormData } from '~/routes/api.contact'

export const sendSlack = async (form: ContactFormData) => {
  const slack = new Slack.IncomingWebhook(process.env.SLACK_WEBHOOK as string)
  await slack.send({ text: JSON.stringify(form) })
}
