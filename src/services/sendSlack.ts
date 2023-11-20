export const sendSlack = async (text: string) => {
  return await fetch(import.meta.env.SLACK_WEBHOOK!, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
