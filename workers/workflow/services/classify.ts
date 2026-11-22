import type { ContactInquiry } from '../types.ts'

export const CLASSIFY_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

const MAX_BODY_CHARS = 1000

export type LlmVerdict = 'sales' | 'gray' | 'normal'

export type Classification = {
  verdict: LlmVerdict
  confidence: number
  reason: string
  model: string
}

const SYSTEM_PROMPT = `あなたは株式会社TechTalk（新規事業の技術検証・プロダクト開発を、代表が経営者と一緒に進める会社）の問い合わせフォームに届いたメッセージを分類します。必ずJSONのみ出力してください。

判断の軸は「お金と仕事の向き」です。
- "sales": 送信者が自分の商品・サービス・人材・媒体をTechTalkに売り込む、または利用を勧める連絡。TechTalkの事業内容（MVP開発、新規事業支援など）に触れていても、送信者側のサービスを提案していれば sales。広告・SEO・AIO・人材紹介・派遣・採用支援・営業代行・アポ獲得・資金調達支援・事業売却・研修・オフィス・掲載料や広告費のかかる取材や掲載・フランチャイズ・モニター募集・セミナー集客など
- "normal": TechTalkに仕事を頼みたい・相談したい連絡。開発や技術検証の依頼、新しい事業の相談、見積依頼、TechTalkに発注を前提とした協業の相談、採用への応募、既存の取引先からの連絡、イベントや講演の依頼など
- "gray": どちらとも決められないもの。メディアからの取材や寄稿の依頼で、費用の話がないものも gray

送信者の会社が何かを売っていても、TechTalkに仕事を頼む内容なら normal です。
出力形式: {"verdict":"sales|gray|normal","confidence":0から100の整数,"reason":"理由を日本語30字以内で"}`

const VERDICTS: readonly LlmVerdict[] = ['sales', 'gray', 'normal']

/** 判定できなかったとき。Workflow のステップはこの例外でやり直す */
export class ClassifyError extends Error {
  override name = 'ClassifyError'
}

const parseResponse = (text: string, model: string): Classification | null => {
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
      model,
    }
  } catch {
    return null
  }
}

/**
 * Workers AI の応答から本文を取り出す。
 * モデルによって `{ response }`（旧来の形）と OpenAI 互換の `{ choices }` のどちらかで返る
 */
const extractText = (result: unknown): string => {
  if (typeof result !== 'object' || result === null) {
    return ''
  }
  if ('response' in result) {
    let response = result.response
    if (typeof response === 'string') {
      return response
    }
    if (typeof response === 'object' && response !== null) {
      return JSON.stringify(response)
    }
  }
  if ('choices' in result && Array.isArray(result.choices)) {
    let content = result.choices[0]?.message?.content
    if (typeof content === 'string') {
      return content
    }
  }
  return ''
}

/**
 * 問い合わせを営業かどうか判定する。
 * AI の呼び出しや応答の読み取りに失敗したら ClassifyError を投げる（握りつぶして
 * 「通常」にすると、モデルの廃止やタイムアウトのたびに営業が素通りする）
 */
export const classifyInquiry = async (
  ai: Ai,
  inquiry: ContactInquiry,
  options: { model?: string } = {},
): Promise<Classification> => {
  let model = options.model ?? CLASSIFY_MODEL
  let result: unknown
  try {
    result = await (
      ai.run as (model: string, input: object) => Promise<unknown>
    )(model, {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `名前: ${inquiry.name}\n会社: ${inquiry.company || '(未記入)'}\n本文:\n${inquiry.message.slice(0, MAX_BODY_CHARS)}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0,
      response_format: { type: 'json_object' },
    })
  } catch (error) {
    throw new ClassifyError(
      `AI の呼び出しに失敗: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    )
  }
  let text = extractText(result)
  let classification = parseResponse(text, model)
  if (!classification) {
    throw new ClassifyError(`判定結果を読み取れない: ${text.slice(0, 200)}`)
  }
  return classification
}

/** やり直しても判定できなかったときの扱い。通知を止めず「要確認」として届ける */
export const unclassified = (error: unknown): Classification => ({
  verdict: 'gray',
  confidence: 0,
  reason:
    `判定できず(${error instanceof Error ? error.message : String(error)})`.slice(
      0,
      300,
    ),
  model: CLASSIFY_MODEL,
})
