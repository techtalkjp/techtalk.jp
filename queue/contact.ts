import type { ContactFormData } from '~/routes/_public+/api.contact/types'
import { sendEmail } from './functions/sendEmail'
import { sendSlack } from './functions/sendSlack'

export const contactJob = async (
  data: ContactFormData,
  env: Env,
): Promise<void> => {
  await Promise.all([
    sendEmail(env.SENDGRID_API_KEY, data),
    sendSlack(env.SLACK_WEBHOOK, data),
  ])
}
