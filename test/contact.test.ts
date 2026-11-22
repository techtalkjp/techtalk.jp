import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { scoreSales } from '../app/contact/score-sales.ts'
import type { ContactFormData } from '../app/contact/types.ts'
import { createTranslate } from '../app/i18n/index.ts'
import {
  type Classification,
  ClassifyError,
  classifyInquiry,
  unclassified,
} from '../workers/workflow/services/classify.ts'
import {
  escapeMrkdwn,
  sendSlack,
  SlackError,
  truncateForSlack,
} from '../workers/workflow/services/slack.ts'

const base: ContactFormData = {
  name: '山田',
  email: 'yamada@example.com',
  message: '',
  privacyPolicy: true,
  locale: 'ja',
}

describe('scoreSales', () => {
  it('scores typical sales outreach as sales', () => {
    let result = scoreSales({
      ...base,
      message:
        '突然のご連絡失礼いたします。ご担当者様へ、無料の集客キャンペーンのご紹介です。https://timerex.net/s/abc 配信停止はこちら',
    })
    assert.equal(result.tier, 'sales')
  })

  it('scores a plain inquiry as normal', () => {
    let result = scoreSales({ ...base, message: '開発のご相談をしたいです。' })
    assert.equal(result.tier, 'normal')
    assert.equal(result.score, 0)
  })
})

describe('createTranslate', () => {
  it('returns Japanese as-is and translates to English', () => {
    assert.equal(createTranslate('ja')('会社概要'), '会社概要')
    assert.equal(createTranslate('en')('会社概要'), 'Company')
  })

  it('fills placeholders', () => {
    assert.equal(
      createTranslate('en')('{max}文字以内で入力してください', { max: 100 }),
      'Please enter 100 characters or fewer.',
    )
  })
})

describe('slack', () => {
  it('escapes mrkdwn control characters', () => {
    assert.equal(
      escapeMrkdwn('<!channel> & <a|b>'),
      '&lt;!channel&gt; &amp; &lt;a|b&gt;',
    )
  })

  it('keeps long messages under the section limit without cutting entities', () => {
    let text = truncateForSlack(escapeMrkdwn('&'.repeat(3000)))
    assert.ok(text.length < 3000)
    assert.doesNotMatch(text, /&[a-z]*…/)
  })
})

describe('sendSlack', () => {
  let inquiry = { ...base, message: 'hi', rule: scoreSales(base) }
  let classification = {
    verdict: 'normal',
    confidence: 90,
    reason: '',
  } as Classification

  async function sendWithStatus(status: number) {
    let original = globalThis.fetch
    globalThis.fetch = async () => new Response(null, { status })
    try {
      await sendSlack('https://hooks.example/x', inquiry, classification)
      return null
    } catch (error) {
      return error
    } finally {
      globalThis.fetch = original
    }
  }

  it('resolves when Slack accepts the message', async () => {
    assert.equal(await sendWithStatus(200), null)
  })

  it('marks revoked webhooks as permanent and rate limits as retryable', async () => {
    let revoked = await sendWithStatus(404)
    assert.ok(revoked instanceof SlackError && revoked.permanent)
    let limited = await sendWithStatus(429)
    assert.ok(limited instanceof SlackError && !limited.permanent)
    let down = await sendWithStatus(503)
    assert.ok(down instanceof SlackError && !down.permanent)
  })
})

describe('classifyInquiry', () => {
  const inquiry = {
    ...base,
    message: '開発のご相談をしたいです。',
    rule: { score: 0, tier: 'normal' as const, reasons: [] },
  }
  const fakeAi = (run: () => Promise<unknown>) => ({ run }) as unknown as Ai

  it('reads a { response } result', async () => {
    let result = await classifyInquiry(
      fakeAi(async () => ({
        response: '{"verdict":"sales","confidence":90,"reason":"営業"}',
      })),
      inquiry,
    )
    assert.equal(result.verdict, 'sales')
    assert.equal(result.confidence, 90)
  })

  it('reads an OpenAI-style { choices } result', async () => {
    let result = await classifyInquiry(
      fakeAi(async () => ({
        choices: [
          { message: { content: '{"verdict":"normal","confidence":80}' } },
        ],
      })),
      inquiry,
    )
    assert.equal(result.verdict, 'normal')
  })

  it('throws instead of passing the inquiry as normal when the AI call fails', async () => {
    await assert.rejects(
      classifyInquiry(
        fakeAi(async () => {
          throw new Error('5028: model was deprecated')
        }),
        inquiry,
      ),
      ClassifyError,
    )
  })

  it('throws when the response cannot be read', async () => {
    await assert.rejects(
      classifyInquiry(
        fakeAi(async () => ({ response: 'わかりません' })),
        inquiry,
      ),
      ClassifyError,
    )
  })

  it('treats a classification that gave up as gray', () => {
    assert.equal(unclassified(new Error('timeout')).verdict, 'gray')
  })
})
