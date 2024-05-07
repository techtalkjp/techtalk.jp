import { z } from 'zod'

export const schema = z.object({
  type: z.enum(['inside-form', 'outside-form']),
  option: z.enum(['option1', 'option2']).optional(),
})
