import { err, ok } from 'neverthrow'
import { sendEmail } from '../services/email'
import { sendSlack } from '../services/slack'
import type { ContactFormData } from '../types'

export const contactJob = async (data: ContactFormData, env: Env) => {
  try {
    const results = await Promise.allSettled([
      sendEmail(env.SENDGRID_API_KEY, data),
      sendSlack(env.SLACK_WEBHOOK, data),
    ])

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('Operation failed:', result.reason)
      }

      const allFailed = results.every((result) => result.status === 'rejected')
      if (allFailed) {
        return err('All notification channels failed')
      }
    }
    return ok()
  } catch (error) {
    console.error('Unexpected error:', error)
    return err('Unexpected error')
  }
}
