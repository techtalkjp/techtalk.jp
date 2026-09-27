import { predictText } from './text-features.ts'
import type { MlVerdict } from './text-features'
import { textModel } from './text-model.ts'

export type ShadowClassification = {
  verdict: MlVerdict | null
  /** 未校正のsoftmaxスコア。正解率・LLM確信度との比較には使わない。 */
  score: number | null
  model: string
  error: string | null
}

// 外部API・ネットワーク・LLMを使わない。通知の振り分けには参照しない。
export const classifyShadow = (message: string): ShadowClassification => {
  try {
    const prediction = predictText(textModel, message)
    return {
      verdict: prediction.verdict,
      score: prediction.score,
      model: textModel.version,
      error: null,
    }
  } catch {
    return {
      verdict: null,
      score: null,
      model: textModel.version,
      error: 'prediction-failed',
    }
  }
}
