export type { ContactFormData } from '~/routes/_public+/api.contact/types'
import {
  env,
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from 'cloudflare:workers'
import { sendEmail } from './services/email'
import { sendSlack } from './services/slack'
import type { ContactFormData } from './types'
type Params = ContactFormData

export class ContactWorkflow extends WorkflowEntrypoint<Env> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep): Promise<void> {
    const formData = event.payload
    console.log('Received form data:', formData)

    await step.do('sendContactSlack', async () => {
      const result = await sendSlack(env.SLACK_WEBHOOK, formData)
      if (result.isErr()) {
        throw new Error(`Slack notification failed: ${result.error}`)
      }
      console.log('Slack notification sent:', result.value)
    })

    await step.do('sendContactEmail', async () => {
      const result = await sendEmail(env.SENDGRID_API_KEY, formData)
      if (result.isErr()) {
        throw new Error(`Email notification failed: ${result.error}`)
      }
      console.log('Email notification sent:', result.value)
    })
  }
}
