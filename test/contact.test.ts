import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { scoreSales } from '../app/contact/score-sales.ts'
import type { ContactFormData } from '../app/contact/types.ts'
import { createTranslate } from '../app/i18n/index.ts'
import {
  escapeMrkdwn,
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
    assert.equal(createTranslate('en')('会社概要'), 'Company Information')
  })

  it('falls back to Japanese and fills placeholders', () => {
    assert.equal(createTranslate('en')('未翻訳の文言'), '未翻訳の文言')
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
