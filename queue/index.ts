import { match } from 'ts-pattern'
import { contactJob } from './jobs/contact'
import type { ContactFormData } from './types'

export const queue = async (batch: MessageBatch<unknown>, env: Env) => {
  await match(batch.queue)
    .with('techtalk-contact-email', async () => {
      for (const message of batch.messages) {
        await contactJob((message as Message<ContactFormData>).body, env)
      }
    })
    .otherwise(() => {
      console.log('Unknown queue', batch.queue)
    })
}
