import type { ContactFormData } from '~/routes/_public+/api.contact/types'

export const sendSlack = async (webhookUrl: string, data: ContactFormData) => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
  if (!response.ok) {
    throw new Error(
      `Failed to send Slack notification: ${response.status} ${response.statusText}`,
    )
  }
  return data
}
