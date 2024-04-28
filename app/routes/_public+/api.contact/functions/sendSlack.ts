import { fromPromise, type ResultAsync } from 'neverthrow'
import type { ContactFormData, SendSlackError } from '../types'

const sendSlackImpl = async (data: ContactFormData) => {
  await fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
  return data
}

export const sendSlack = (
  data: ContactFormData,
): ResultAsync<ContactFormData, SendSlackError> =>
  fromPromise(sendSlackImpl(data), (e) => ({
    type: 'SendSlackError',
    message: String(e),
  }))
