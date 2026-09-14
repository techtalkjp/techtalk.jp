import { err, ok } from 'neverthrow'
import type { Classification } from './classify'
import type { ContactInquiry } from '../types'

export const sendSlack = async (
  webhookUrl: string,
  data: ContactInquiry,
  classification: Classification,
) => {
  const isSales = classification.verdict === 'sales'
  const title = isSales ? '🚫 営業疑いの問い合わせ' : '📧 新しいお問い合わせ'
  const verdictLine =
    `*判定:* LLM=${classification.verdict} (${classification.confidence}%) / ` +
    `ルール=${data.rule.score} (${data.rule.tier})`
  const reasonLine =
    `*理由:* LLM: ${classification.reason || '(なし)'} / ` +
    `ルール: ${data.rule.reasons.join('、') || '(なし)'}`
  const payload = {
    text: isSales
      ? `[営業疑い] 新しいお問い合わせ: ${data.name}様`
      : '新しいお問い合わせがあります',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: title,
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
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${verdictLine}\n${reasonLine}`,
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
