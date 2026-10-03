import type { RuleScore } from './score-sales.ts'

export type ContactFormData = {
  name: string
  company?: string
  phone?: string
  email: string
  message: string
  privacyPolicy: boolean
  locale: string
}

export type { RuleScore, RuleTier } from './score-sales.ts'

/**
 * ContactWorkflow に渡すペイロード。
 * rule は shadow mode の評価記録用（振り分けには使わない）。
 */
export type ContactInquiry = ContactFormData & {
  rule: RuleScore
}
