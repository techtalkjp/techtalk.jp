import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import type { Route } from './+types/route'

export const action = async ({ request }: Route.ActionArgs) => {
  const { messages } = await request.json<{
    messages: {
      role: 'user' | 'assistant'
      content: string
    }[]
  }>()

  const result = await streamText({
    model: google('gemini-2.5-flash-preview-05-20'),
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    toolCallStreaming: true,
    onError: (error) => {
      console.log(error)
    },
  })

  return result.toDataStreamResponse()
}
