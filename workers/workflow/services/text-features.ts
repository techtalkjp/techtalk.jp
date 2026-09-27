// 保存済みの抜粋と同じ範囲を使う。学習と推論の前処理を共用する。
export const ML_INPUT_CHARS = 500
export const ML_LABELS = ['sales', 'gray', 'normal'] as const
export type MlVerdict = (typeof ML_LABELS)[number]

export type TextModel = {
  version: string
  source: 'synthetic-bootstrap' | 'human-labeled'
  trainingCount: number
  trainingIds: number[]
  weights: Record<string, number[]>
  bias: number[]
}

export const textFeatures = (message: string): Set<string> => {
  const text = message
    .slice(0, ML_INPUT_CHARS)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/gu, ' ')
    .trim()
  const chars = Array.from(text)
  const features = new Set<string>()
  for (const size of [2, 3, 4]) {
    for (let i = 0; i <= chars.length - size; i++) {
      features.add(chars.slice(i, i + size).join(''))
    }
  }
  return features
}

export const predictText = (model: TextModel, message: string) => {
  const features = [...textFeatures(message)].filter((feature) =>
    Object.hasOwn(model.weights, feature),
  )
  const scale = 1 / Math.sqrt(features.length || 1)
  const logits = ML_LABELS.map((_, index) => {
    let value = model.bias[index] ?? 0
    for (const feature of features) {
      value += (model.weights[feature]?.[index] ?? 0) * scale
    }
    return value
  })
  const max = Math.max(...logits)
  const exp = logits.map((value) => Math.exp(value - max))
  const sum = exp.reduce((total, value) => total + value, 0)
  const probabilities = exp.map((value) => value / sum)
  const best = logits.indexOf(max)
  return {
    // 未知語だけ・空本文は目的不明。学習データの事前分布で営業にしない。
    verdict: features.length === 0 ? 'gray' : (ML_LABELS[best] ?? 'gray'),
    score: features.length === 0 ? 0 : (probabilities[best] ?? 0),
    matchedFeatures: features.length,
    probabilities,
  }
}
