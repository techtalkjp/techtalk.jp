import type { ContactFormData } from '~/routes/_public+/api.contact/types'

export const sendSlack = async (webhookUrl: string, data: ContactFormData) => {
  await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
  return data
}
