import type { ContactFormData } from '../types'

export type RuleTier = 'sales' | 'gray' | 'normal'

export type RuleScore = {
  score: number
  tier: RuleTier
  reasons: string[]
}

export const RULE_SALES_THRESHOLD = 50
export const RULE_GRAY_THRESHOLD = 25

const SCHEDULER_DOMAINS = [
  'timerex.net',
  'spirinc.com',
  'crowd-calendar.com',
  'calendly.com',
  'janalytics.jp',
]

const OPT_OUT_WORDS = ['配信停止', 'unsubscribe', '配信が不要', '配信を停止']

const GREETING_WORDS = ['突然のご連絡', 'ご担当者様', '代表取締役']

const SALES_KEYWORDS = [
  '無料',
  '0円',
  '０円',
  'キャンペーン',
  '集客',
  '協業',
  'アライアンス',
  'ご紹介',
  '取材',
  '掲載',
  '費用は一切',
  '実績が多数',
]

const URL_RE = /https?:\/\/[^\s)）\]]+/g

/**
 * 営業文のクセに点数を付ける純粋関数。
 * 振り分けには使わず、LLM判定との比較評価用に記録する（shadow mode）。
 */
export const scoreSales = (data: ContactFormData): RuleScore => {
  const reasons: string[] = []
  let score = 0
  const body = data.message

  const urls = body.match(URL_RE) ?? []
  const schedulerUrls = urls.filter((u) =>
    SCHEDULER_DOMAINS.some((domain) => u.includes(domain)),
  )
  if (schedulerUrls.length > 0) {
    score += 40
    reasons.push(`日程調整URL: ${schedulerUrls.length}件`)
  }
  if (urls.length >= 3) {
    score += 20
    reasons.push(`URL${urls.length}件`)
  } else if (urls.length >= 2) {
    score += 10
    reasons.push(`URL${urls.length}件`)
  }

  for (const word of OPT_OUT_WORDS) {
    if (body.includes(word)) {
      score += 40
      reasons.push(`配信停止文言「${word}」`)
      break
    }
  }

  for (const word of GREETING_WORDS) {
    if (body.includes(word)) {
      score += 15
      reasons.push(`定型挨拶「${word}」`)
    }
  }

  if (/\d{1,2}月\d{1,2}日/.test(body) && /\d{1,2}:\d{2}/.test(body)) {
    score += 20
    reasons.push('日時候補の列挙')
  }

  const kishaCount = (body.match(/貴社|御社/g) ?? []).length
  if (kishaCount >= 3) {
    score += 10
    reasons.push(`貴社/御社${kishaCount}回`)
  }

  const hitKeywords = SALES_KEYWORDS.filter((word) => body.includes(word))
  if (hitKeywords.length > 0) {
    score += Math.min(hitKeywords.length * 5, 20)
    reasons.push(`営業KW: ${hitKeywords.join('、')}`)
  }

  const tier: RuleTier =
    score >= RULE_SALES_THRESHOLD
      ? 'sales'
      : score >= RULE_GRAY_THRESHOLD
        ? 'gray'
        : 'normal'

  return { score, tier, reasons }
}
