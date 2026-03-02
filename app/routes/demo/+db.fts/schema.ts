import { z } from 'zod'

export const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('add'),
    title: z.string().min(1, 'タイトルは必須です').max(255),
    body: z.string().min(1, '本文は必須です').max(10000),
  }),
  z.object({
    intent: z.literal('delete'),
    id: z.coerce.number(),
  }),
  z.object({
    intent: z.literal('seed'),
  }),
])
