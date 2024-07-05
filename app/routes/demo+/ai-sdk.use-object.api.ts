import { openai } from '@ai-sdk/openai'
import type { ActionFunctionArgs } from '@remix-run/node'
import { streamObject } from 'ai'
import { z } from 'zod'

export const config = { runtime: 'edge' }

export const schema = z.object({
  id: z.string(),
  nicknames: z.array(z.string()),
})
export const action = async ({ request }: ActionFunctionArgs) => {
  const stream = await streamObject({
    model: openai('gpt-4o'),
    schema,
    prompt: 'Generate nicknames for a person',
  })

  return stream.toTextStreamResponse()
}
