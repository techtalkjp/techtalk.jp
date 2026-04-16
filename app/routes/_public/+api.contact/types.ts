import { z } from 'zod'

export const schema = z.object({
  name: z
    .string({ message: 'お名前を入力してください' })
    .max(100, '100文字以内で入力してください'),
  company: z.string().max(100, '100文字以内で入力してください').optional(),
  phone: z.string().max(20, '20文字以内で入力してください').optional(),
  email: z
    .string({ message: 'メールアドレスを入力してください' })
    .max(100, '100文字以内で入力してください')
    .email('正しいメールアドレスを入力してください'),
  message: z
    .string({ message: 'メッセージを入力してください' })
    .max(10000, '10000文字以内で入力してください'),
  companyPhone: z.string().max(20).optional(),
  privacyPolicy: z
    .string({ message: 'プライバシーポリシーへの同意が必要です' })
    .transform((value) => value === 'on'),
  locale: z.string(),
})

export type ContactFormData = z.infer<typeof schema>
