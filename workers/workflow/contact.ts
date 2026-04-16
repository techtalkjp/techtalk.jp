export type { ContactFormData } from '~/routes/_public/+api.contact/types'
import {
  env,
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from 'cloudflare:workers'
import { sendNotificationEmail, sendReplyEmail } from './services/email'
import { sendSlack } from './services/slack'
import type { ContactFormData } from './types'

export class ContactWorkflow extends WorkflowEntrypoint<Env> {
  async run(
    event: WorkflowEvent<ContactFormData>,
    step: WorkflowStep,
  ): Promise<void> {
    const formData = event.payload
    console.log('Received form data:', formData)

    await step.do('sendContactSlack', async () => {
      const result = await sendSlack(env.SLACK_WEBHOOK, formData)
      if (result.isErr()) {
        throw new Error(`Slack notification failed: ${result.error}`)
      }
      console.log('Slack notification sent:', result.value)
    })

    await step.do('sendNotificationEmail', async () => {
      const result = await sendNotificationEmail(env.EMAIL, formData)
      if (result.isErr()) {
        throw new Error(result.error)
      }
      console.log('Notification email sent to info@techtalk.jp')
    })

    await step.do('sendReplyEmail', async () => {
      const result = await sendReplyEmail(env.EMAIL, formData)
      if (result.isErr()) {
        throw new Error(result.error)
      }
      console.log('Reply email sent to', formData.email)
    })
  }
}
