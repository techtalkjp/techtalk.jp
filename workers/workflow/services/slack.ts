import { err, ok } from 'neverthrow'
import type { ContactFormData } from '../types'

export const sendSlack = async (webhookUrl: string, data: ContactFormData) => {
  const payload = {
    text: '新しいお問い合わせがあります',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📧 新しいお問い合わせ',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*名前:*\n${data.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*メール:*\n${data.email}`,
          },
          ...(data.company
            ? [
                {
                  type: 'mrkdwn',
                  text: `*会社:*\n${data.company}`,
                },
              ]
            : []),
          ...(data.phone
            ? [
                {
                  type: 'mrkdwn',
                  text: `*電話:*\n${data.phone}`,
                },
              ]
            : []),
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*メッセージ:*\n${data.message}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `言語: ${data.locale} | プライバシーポリシー: ${data.privacyPolicy ? '同意済み' : '未同意'}`,
          },
        ],
      },
    ],
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return err(
      `Failed to send Slack notification: ${response.status} ${response.statusText}`,
    )
  }
  return ok()
}
