import { fromPromise, type ResultAsync } from 'neverthrow'
import type { ContactFormData } from '../types'

type SendSlackError = { type: 'SendSlackError'; message: string }
const sendSlackImpl = async (webhookUrl: string, data: ContactFormData) => {
  await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
  return data
}

export const sendSlack = (
  webhookUrl: string,
  data: ContactFormData,
): ResultAsync<ContactFormData, SendSlackError> =>
  fromPromise(sendSlackImpl(webhookUrl, data), (e) => ({
    type: 'SendSlackError',
    message: String(e),
  }))
