import type { Classification } from './classify'
import type { ContactInquiry } from '../types'

export type RoutedAs = 'sales' | 'normal'

/**
 * ルールスコアとLLM判定をD1に記録する。
 * Phase B（ルールへの置き換え検討）の評価材料にする。
 */
export const logEvaluation = async (
  db: D1Database,
  inquiry: ContactInquiry,
  classification: Classification,
  routedAs: RoutedAs,
): Promise<void> => {
  await db
    .prepare(
      `INSERT INTO inquiry_evaluations
        (name, email, company, message_excerpt, rule_score, rule_tier, rule_reasons,
         llm_verdict, llm_confidence, llm_reason, llm_model, routed_as)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      inquiry.name,
      inquiry.email,
      inquiry.company ?? null,
      inquiry.message.slice(0, 500),
      inquiry.rule.score,
      inquiry.rule.tier,
      JSON.stringify(inquiry.rule.reasons),
      classification.verdict,
      classification.confidence,
      classification.reason,
      classification.model,
      routedAs,
    )
    .run()
}
