import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import type { Route } from './+types/api.chat'
import { pdfExtractTool } from './_index/tools/pdf-extract-tool.server'

/**
 * チャット API エンドポイント
 * POST /api/chat
 */
export const action = async ({ request }: Route.ActionArgs) => {
  const body = (await request.json()) as { messages: UIMessage[] }

  const result = streamText({
    model: 'google/gemini-2.5-flash',
    messages: convertToModelMessages(body.messages),
    tools: {
      pdfExtract: pdfExtractTool,
    },
  })

  return result.toUIMessageStreamResponse()
}
