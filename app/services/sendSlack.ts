export const sendSlack = async (text: string) => {
  return await fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
