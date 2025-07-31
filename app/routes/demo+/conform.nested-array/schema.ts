import { z } from 'zod'

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string({ error: '必須' }),
  gender: z.union(
    [z.literal('male'), z.literal('female'), z.literal('non-binary')],
    { error: '性別を選択してください' },
  ),
  zip: z
    .string({ error: '必須' })
    .regex(/^\d{3}-\d{4}$/, { message: '000-0000形式' }),
  tel: z
    .string({ error: '必須' })
    .regex(/^\d{3}-\d{4}-\d{4}$/, { message: '000-0000-0000形式' }),
  email: z.string({ error: '必須' }).email({ message: 'メールアドレス' }),
})

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string({ error: '必須' }),
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
