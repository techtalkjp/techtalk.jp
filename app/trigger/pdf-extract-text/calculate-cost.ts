export const calculateCost = async (usage: {
  promptTokens: number
  completionTokens: number
}) => {
  const ret = await fetch('https://api.excelapi.org/currency/rate?pair=usd-jpy')
  const usdToJpy = Number(await ret.text())

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
