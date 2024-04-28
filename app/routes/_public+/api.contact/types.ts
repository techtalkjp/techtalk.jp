import { z } from 'zod'

export const schema = z.object({
  name: z.string().max(100),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().max(100).email(),
  message: z.string().max(10000),
  companyPhone: z.string().max(20).optional(),
  privacyPolicy: z.string().transform((value) => value === 'on'),
  locale: z.string(),
})

export type ContactFormData = z.infer<typeof schema>

export type HoneypotError = { type: 'HoneypotError'; message: string }
export type TestEmailError = { type: 'TestEmailError'; message: string }
export type SendEmailError = { type: 'SendEmailError'; message: string }
export type SendSlackError = { type: 'SendSlackError'; message: string }
