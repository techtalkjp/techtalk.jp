import { fromPromise } from 'neverthrow'
import type { ContactFormData } from '../types'

export const sendSlack = (data: ContactFormData) =>
  fromPromise(
    fetch(process.env.SLACK_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({ data }),
    }),
    (e) => String(e),
  )
