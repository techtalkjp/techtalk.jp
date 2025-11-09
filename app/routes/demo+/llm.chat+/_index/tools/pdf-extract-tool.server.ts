import { tool } from 'ai'
import { z } from 'zod'
import { calculateCost } from '~/routes/demo+/llm.pdf-textize/server/pdf-extract-text/calculate-cost'
import { extractTextWithLLM } from '~/routes/demo+/llm.pdf-textize/server/pdf-extract-text/extract-text-with-llm'
import { prepareFileContents } from '~/routes/demo+/llm.pdf-textize/server/pdf-extract-text/prepare-file-content'

/**
 * PDF/画像からテキストを抽出するツール
 */
export const pdfExtractTool = tool({
  description:
    'PDFファイルや画像ファイルからテキストを抽出します。ファイルURLを指定してください。',
  inputSchema: z.object({
    fileUrl: z.string().url().describe('抽出対象のファイルのURL'),
    prompt: z.string().optional().describe('抽出時の追加指示（オプション）'),
  }),
  execute: async ({ fileUrl, prompt }) => {
    // URLからファイルをフェッチ
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    const blob = await response.blob()
    const file = new File([blob], 'file', { type: blob.type })

    // ファイルの内容を準備
    const content = await prepareFileContents(file)
    if (content === null) {
      throw new Error('Unsupported file type')
    }

    // LLMでテキストを抽出
    const result = await extractTextWithLLM([content], prompt)

    // コストを計算
    const cost = calculateCost(result.usage)

    return {
      text: result.text,
      tokens: {
        input: result.usage.inputTokens ?? 0,
        output: result.usage.outputTokens ?? 0,
      },
      cost: {
        amount: cost.total.jpy,
        currency: 'JPY',
      },
    }
  },
})
