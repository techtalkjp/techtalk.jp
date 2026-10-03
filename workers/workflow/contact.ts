export type { ContactFormData } from './types.ts'
import { NonRetryableError } from 'cloudflare:workflows'
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from 'cloudflare:workers'
import { classifyInquiry } from './services/classify.ts'
import { sendNotificationEmail, sendReplyEmail } from './services/email.tsx'
import { logEvaluation, type RoutedAs } from './services/evaluations.ts'
import { sendSlack } from './services/slack.ts'
import type { ContactInquiry } from './types.ts'

export class ContactWorkflow extends WorkflowEntrypoint<Env> {
  async run(
    event: WorkflowEvent<ContactInquiry>,
    step: WorkflowStep,
  ): Promise<void> {
    const env = this.env
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

    if (routedAs === 'sales') {
      // 営業疑いは通知も返信も止める。記録は inquiry_evaluations に残る。
      console.log('Notifications and reply skipped (sales verdict)')
      return
    }

    // 社内への通知は「通知メール」と「Slack」の 2 系統。並べて走らせ、互いの失敗やリトライ待ちに
    // 巻き込まれないようにする。どちらも届かなければ自動返信は送らずに Workflow を失敗にする
    // （利用者に「受け付けました」と返したあとで取りこぼすのを避ける）
    const [email, slack] = await Promise.allSettled([
      step.do('sendNotificationEmail', NOTIFY_STEP, async () => {
        const result = await sendNotificationEmail(
          env.EMAIL,
          inquiry,
          classification,
        )
        if (result.isErr()) throw new Error(result.error)
        console.log('Notification email sent to info@techtalk.jp')
      }),
      step.do('sendContactSlack', NOTIFY_STEP, async () => {
        const result = await sendSlack(
          env.SLACK_WEBHOOK,
          inquiry,
          classification,
        )
        if (result.isErr()) {
          const { message, permanent } = result.error
          throw permanent ? new NonRetryableError(message) : new Error(message)
        }
        console.log('Slack notification sent')
      }),
    ])
    for (const [channel, outcome] of [
      ['Notification email', email],
      ['Slack notification', slack],
    ] as const) {
      if (outcome.status === 'rejected') {
        rethrowEngineError(outcome.reason)
        console.error(`${channel} gave up:`, outcome.reason)
      }
    }
    if (email.status === 'rejected' && slack.status === 'rejected') {
      throw new Error('All notifications failed; reply not sent')
    }

    // 自動返信は宛先が利用者の入力なので失敗しやすい。失敗しても社内には届いているので、
    // 記録だけ残して Workflow は成功で終える
    try {
      await step.do('sendReplyEmail', NOTIFY_STEP, async () => {
        const result = await sendReplyEmail(env.EMAIL, inquiry)
        if (result.isErr()) throw new Error(result.error)
        console.log('Reply email sent to', inquiry.email)
      })
    } catch (error) {
      rethrowEngineError(error)
      console.error('Reply email gave up:', error)
    }
  }
}

/** 通知系のステップ。待たせすぎず、数回だけやり直す */
const NOTIFY_STEP = {
  retries: { limit: 3, delay: '10 seconds', backoff: 'exponential' },
  timeout: '1 minute',
} as const

/**
 * 一時停止や終了など、Workflow エンジン自身の制御で投げられたエラーは握りつぶさずに投げ直す。
 * 握りつぶしてよいのは送信の失敗だけ
 */
function rethrowEngineError(error: unknown): void {
  if (error instanceof Error && error.message.startsWith('Aborting engine')) {
    throw error
  }
}
