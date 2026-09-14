export type { ContactFormData } from '~/routes/_public/+api.contact/types'
import {
  env,
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from 'cloudflare:workers'
import { classifyInquiry } from './services/classify'
import { sendNotificationEmail, sendReplyEmail } from './services/email'
import { logEvaluation, type RoutedAs } from './services/evaluations'
import { sendSlack } from './services/slack'
import type { ContactInquiry } from './types'

export class ContactWorkflow extends WorkflowEntrypoint<Env> {
  async run(
    event: WorkflowEvent<ContactInquiry>,
    step: WorkflowStep,
  ): Promise<void> {
    const inquiry = event.payload
    console.log('Received inquiry:', inquiry.name, inquiry.email)

    const classification = await step.do('classifyInquiry', async () => {
      const result = await classifyInquiry(env.AI, inquiry)
      console.log('Classification:', result)
      return result
    })

    // 振り分けの主役はLLM。rule は shadow mode の評価記録用。
    const routedAs: RoutedAs =
      classification.verdict === 'sales' ? 'sales' : 'normal'

    await step.do('logEvaluation', async () => {
      try {
        await logEvaluation(env.DB, inquiry, classification, routedAs)
      } catch (error) {
        // 評価ログの失敗で本流を止めない
        console.warn('Evaluation logging failed:', error)
      }
    })

    await step.do('sendContactSlack', async () => {
      const result = await sendSlack(env.SLACK_WEBHOOK, inquiry, classification)
      if (result.isErr()) {
        throw new Error(`Slack notification failed: ${result.error}`)
      }
      console.log('Slack notification sent:', result.value)
    })

    await step.do('sendNotificationEmail', async () => {
      const result = await sendNotificationEmail(
        env.EMAIL,
        inquiry,
        classification,
      )
      if (result.isErr()) {
        throw new Error(result.error)
      }
      console.log('Notification email sent to info@techtalk.jp')
    })

    if (routedAs === 'sales') {
      console.log('Reply email skipped (sales verdict)')
      return
    }

    await step.do('sendReplyEmail', async () => {
      const result = await sendReplyEmail(env.EMAIL, inquiry)
      if (result.isErr()) {
        throw new Error(result.error)
      }
      console.log('Reply email sent to', inquiry.email)
    })
  }
}
