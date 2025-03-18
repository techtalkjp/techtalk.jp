export const calculateCost = (usage: {
  promptTokens: number
  completionTokens: number
}) => {
  const PROMPT_TOKEN_RATE = 0.1 // $ per million tokens
  const COMPLETION_TOKEN_RATE = 0.4 // $ per million tokens
  const USD_TO_JPY = 150

  return {
    prompt: {
      tokens: usage.promptTokens,
      usd: (usage.promptTokens / 1000000) * PROMPT_TOKEN_RATE,
      jpy: (usage.promptTokens / 1000000) * PROMPT_TOKEN_RATE * USD_TO_JPY,
    },
    completion: {
      tokens: usage.completionTokens,
      usd: (usage.completionTokens / 1000000) * COMPLETION_TOKEN_RATE,
      jpy:
        (usage.completionTokens / 1000000) * COMPLETION_TOKEN_RATE * USD_TO_JPY,
    },
    total: {
      tokens: usage.promptTokens + usage.completionTokens,
      usd:
        (usage.promptTokens / 1000000) * PROMPT_TOKEN_RATE +
        (usage.completionTokens / 1000000) * COMPLETION_TOKEN_RATE,
      jpy:
        ((usage.promptTokens / 1000000) * PROMPT_TOKEN_RATE +
          (usage.completionTokens / 1000000) * COMPLETION_TOKEN_RATE) *
        USD_TO_JPY,
    },
  }
}
