export const calculateCost = (usage: {
  promptTokens: number
  completionTokens: number
}) => {
  const usdToJpy = 150

  return {
    prompt: {
      tokens: usage.promptTokens,
      usd: (usage.promptTokens / 1000000) * 0.1,
      jpy: (usage.promptTokens / 1000000) * 0.1 * usdToJpy,
    },
    completion: {
      tokens: usage.completionTokens,
      usd: (usage.completionTokens / 1000000) * 0.4,
      jpy: (usage.completionTokens / 1000000) * 0.4 * usdToJpy,
    },
    total: {
      tokens: usage.promptTokens + usage.completionTokens,
      usd:
        (usage.promptTokens / 1000000) * 0.075 +
        (usage.completionTokens / 1000000) * 0.3,
      jpy:
        ((usage.promptTokens / 1000000) * 0.075 +
          (usage.completionTokens / 1000000) * 0.3) *
        usdToJpy,
    },
  }
}
