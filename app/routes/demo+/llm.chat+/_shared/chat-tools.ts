import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import type { pdfExtractTool } from '~/routes/demo+/llm.chat+/_index/tools/pdf-extract-tool.server'

/**
 * アプリで使用する全ツールをまとめた型
 * ツールを追加する際は、ここに型を追加する
 *
 * @example
 * export type ChatToolSet = {
 *   pdfExtract: typeof pdfExtractTool
 *   webSearch: ReturnType<typeof openai.tools.webSearch>
 * }
 */
export type ChatToolSet = {
  pdfExtract: typeof pdfExtractTool
}

/**
 * InferUITools でツールセットから UI 用の型を推論
 * これにより、各ツールの入出力型が自動的に推論される
 */
export type ChatUITools = InferUITools<ChatToolSet>

/**
 * チャットメッセージの型
 * この型を使うことで、メッセージにツール情報が含まれることが保証される
 */
export type ChatUIMessage = UIMessage<never, UIDataTypes, ChatUITools>

/**
 * ツール呼び出し部分の型
 * Extract を使って、メッセージパーツからツール関連のものだけを抽出
 */
export type ChatToolPart = Extract<
  NonNullable<ChatUIMessage['parts']>[number],
  { type: `tool-${string}` }
>

/**
 * 特定のツールの型を抽出するヘルパー型
 *
 * @example
 * type PdfExtractPart = ExtractToolPart<'pdfExtract'>
 */
export type ExtractToolPart<T extends keyof ChatToolSet> = Extract<
  ChatToolPart,
  { type: `tool-${T}` }
>
