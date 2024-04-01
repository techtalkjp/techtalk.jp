import { ResultAsync } from 'neverthrow'
import type { ContactFormData } from '../route'

export const sendSlack = (data: ContactFormData) =>
  ResultAsync.fromPromise(
    fetch(process.env.SLACK_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({ data }),
    }),
    (e) => e as Error,
  )
