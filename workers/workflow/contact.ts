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

    await step.do('sendContactSlack', async () => {
      const result = await sendSlack(env.SLACK_WEBHOOK, formData)
      result
        .map((result) => {
          console.log('Slack notification sent:', result)
        })
        .mapErr((error) => {
          throw new Error(`Slack notification failed: ${error}`)
        })
    })

    await step.do('sendContactEmail', async () => {
      const result = await sendEmail(env.SENDGRID_API_KEY, formData)
      result
        .map((result) => {
          console.log('Email notification sent:', result)
        })
        .mapErr((error) => {
          throw new Error(`Email notification failed: ${error}`)
        })
    })
  }
}
