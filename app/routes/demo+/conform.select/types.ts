import { z } from 'zod'

export enum FormType {
  INSIDE_FORM = 'inside-form',
  OUTSIDE_FORM = 'outside-form',
}

export const schema = z.object({
  formType: z.enum(FormType),
  option: z.enum(['option1', 'option2']).optional(),
})
