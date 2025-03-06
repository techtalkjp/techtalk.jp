import { err, ok } from 'neverthrow'
import type { ContactFormData } from '../types'

export const sendSlack = async (webhookUrl: string, data: ContactFormData) => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
  if (!response.ok) {
    return err(
      `Failed to send Slack notification: ${response.status} ${response.statusText}`,
    )
  }
  return ok()
}
