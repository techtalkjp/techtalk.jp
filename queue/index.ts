import { match } from 'ts-pattern'
import { contactJob } from './jobs/contact'
import type { ContactFormData } from './types'

export const queue = async (batch: MessageBatch<unknown>, env: Env) => {
  const queueName = batch.queue

  await match(queueName)
    .with('techtalk-contact-email', async () => {
      for (const message of batch.messages) {
        const data = message.body as ContactFormData
        const result = await contactJob(data, env)
        if (result.isOk()) {
          console.log('Contact form sent successfully')
        } else {
          console.error('Contact form failed:', result.error)
        }
      }
    })
    .otherwise(() => {
      console.log('Unknown queue:', queueName)
    })
}
