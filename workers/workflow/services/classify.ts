import type { ContactInquiry } from '../types'

export const CLASSIFY_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8'

const MAX_BODY_CHARS = 1000

export type LlmVerdict = 'sales' | 'gray' | 'normal'

export type Classification = {
  verdict: LlmVerdict
  confidence: number
  reason: string
  model: string
}

const SYSTEM_PROMPT = `あなたは企業サイトの問い合わせフォームに届いたメッセージを分類します。必ずJSONのみ出力してください。
- "sales": 営業・売り込み・協業提案・取材商法・セミナー集客・採用支援営業など、販売や商談獲得が目的の連絡
- "normal": 発注・見積依頼・仕事の相談・イベント参加申込など、顧客からの正当な連絡
- "gray": どちらか判断が難しいもの
出力形式: {"verdict":"sales|gray|normal","confidence":0から100の整数,"reason":"理由を日本語30字以内で"}`

const VERDICTS: readonly LlmVerdict[] = ['sales', 'gray', 'normal']

/** 失敗時は fail-open（普通の問い合わせとして扱う） */
const failOpen = (reason: string): Classification => ({
  verdict: 'normal',
  confidence: 0,
  reason,
  model: CLASSIFY_MODEL,
})

const parseResponse = (text: string): Classification | null => {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) {
    return null
  }
  try {
    const json = JSON.parse(match[0]) as {
      verdict?: unknown
      confidence?: unknown
      reason?: unknown
    }
    if (
      typeof json.verdict !== 'string' ||
      !(VERDICTS as readonly string[]).includes(json.verdict)
    ) {
      return null
    }
    return {
      verdict: json.verdict as LlmVerdict,
      confidence:
        typeof json.confidence === 'number'
          ? Math.max(0, Math.min(100, Math.round(json.confidence)))
          : 0,
      reason: typeof json.reason === 'string' ? json.reason : '',
      model: CLASSIFY_MODEL,
    }
  } catch {
    return null
  }
}

export const classifyInquiry = async (
  ai: Ai,
  inquiry: ContactInquiry,
): Promise<Classification> => {
  try {
    const result = await ai.run(CLASSIFY_MODEL, {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `名前: ${inquiry.name}\n会社: ${inquiry.company || '(未記入)'}\n本文:\n${inquiry.message.slice(0, MAX_BODY_CHARS)}`,
        },
      ],
      max_tokens: 256,
      temperature: 0,
      response_format: { type: 'json_object' },
    })
    const text =
      typeof result === 'object' &&
      result !== null &&
      'response' in result &&
      typeof result.response === 'string'
        ? result.response
        : ''
    return parseResponse(text) ?? failOpen('分類結果のパース失敗')
  } catch (error) {
    return failOpen(
      `分類スキップ(${error instanceof Error ? error.message : String(error)})`,
    )
  }
}
