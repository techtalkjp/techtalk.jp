import type { generateText } from 'ai'

type CalculateCostUsage = Awaited<ReturnType<typeof generateText>>['usage']

export const calculateCost = (usage: CalculateCostUsage) => {
  const PROMPT_TOKEN_RATE = 0.1 // $ per million tokens
  const COMPLETION_TOKEN_RATE = 0.4 // $ per million tokens
  const USD_TO_JPY = 146.5

  return {
    prompt: {
      tokens: usage.inputTokens,
      usd: (usage.inputTokens ?? 0 / 1000000) * PROMPT_TOKEN_RATE,
      jpy: (usage.inputTokens ?? 0 / 1000000) * PROMPT_TOKEN_RATE * USD_TO_JPY,
    },
    completion: {
      tokens: usage.outputTokens,
      usd: (usage.outputTokens ?? 0 / 1000000) * COMPLETION_TOKEN_RATE,
      jpy:
        (usage.outputTokens ?? 0 / 1000000) *
        COMPLETION_TOKEN_RATE *
        USD_TO_JPY,
    },
    total: {
      tokens: (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0),
      usd:
        (usage.inputTokens ?? 0 / 1000000) * PROMPT_TOKEN_RATE +
        (usage.outputTokens ?? 0 / 1000000) * COMPLETION_TOKEN_RATE,
      jpy:
        ((usage.inputTokens ?? 0 / 1000000) * PROMPT_TOKEN_RATE +
          (usage.outputTokens ?? 0 / 1000000) * COMPLETION_TOKEN_RATE) *
        USD_TO_JPY,
    },
  }
}
