import { err, ok } from 'neverthrow'
import type { Classification } from './classify.ts'
import type { ContactInquiry } from '../types.ts'

/**
 * Slack の mrkdwn で制御文字になる &<> をエスケープする。
 * 利用者の入力に `<!channel>` や `<https://…|偽リンク>` を書かれても効かないようにする
 */
export const escapeMrkdwn = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export const sendSlack = async (
  webhookUrl: string,
  data: ContactInquiry,
  classification: Classification,
) => {
  // 営業判定（sales）の問い合わせは Workflow 側で Slack 通知の前に止めている
  const title = '📧 新しいお問い合わせ'
  const verdictLine =
    `*判定:* LLM=${classification.verdict} (${classification.confidence}%) / ` +
    `ルール=${data.rule.score} (${data.rule.tier})`
  const reasonLine =
    `*理由:* LLM: ${escapeMrkdwn(classification.reason) || '(なし)'} / ` +
    `ルール: ${data.rule.reasons.join('、') || '(なし)'}`
  const payload = {
    text: '新しいお問い合わせがあります',
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
            text: `*名前:*\n${escapeMrkdwn(data.name)}`,
          },
          {
            type: 'mrkdwn',
            text: `*メール:*\n${escapeMrkdwn(data.email)}`,
          },
          ...(data.company
            ? [
                {
                  type: 'mrkdwn',
                  text: `*会社:*\n${escapeMrkdwn(data.company)}`,
                },
              ]
            : []),
          ...(data.phone
            ? [
                {
                  type: 'mrkdwn',
                  text: `*電話:*\n${escapeMrkdwn(data.phone)}`,
                },
              ]
            : []),
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*メッセージ:*\n${escapeMrkdwn(data.message)}`,
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
