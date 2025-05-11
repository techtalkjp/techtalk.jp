import { z } from 'zod'

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: '必須' }),
  gender: z.enum(['male', 'female', 'non-binary'], {
    required_error: '必須',
    message: '性別を選択してください',
  }),
  zip: z
    .string({ required_error: '必須' })
    .regex(/^\d{3}-\d{4}$/, { message: '000-0000形式' }),
  tel: z
    .string({ required_error: '必須' })
    .regex(/^\d{3}-\d{4}-\d{4}$/, { message: '000-0000-0000形式' }),
  email: z
    .string({ required_error: '必須' })
    .email({ message: 'メールアドレス' }),
})

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: '必須' }),
  members: z
    .array(memberSchema)
    .min(1, { message: 'メンバーを追加してください' }),
})

export const formSchema = z.object({
  teams: z.array(teamSchema).min(1, { message: 'チームを追加してください' }),
})

export type MemberSchema = z.infer<typeof memberSchema>
export type TeamSchema = z.infer<typeof teamSchema>
export type FormSchema = z.infer<typeof formSchema>
