import { match } from 'ts-pattern'
import type { ContactFormData } from '~/routes/_public+/api.contact/types'
import { contactJob } from './contact'

export const queue = (batch: MessageBatch<unknown>, env: Env): void => {
  match(batch.queue)
    .with('techtalk-contact-email', () => {
      for (const message of batch.messages) {
        contactJob((message as unknown as Message<ContactFormData>).body, env)
      }
    })
    .otherwise(() => {
      console.log('Unknown queue', batch.queue)
    })
}
