import * as s from 'remix/data-schema'
import { email, maxLength, minLength } from 'remix/data-schema/checks'
import * as f from 'remix/data-schema/form-data'

import type { Translate } from '../i18n/index.ts'

const required = (max: number) =>
  f.field(s.string().pipe(minLength(1), maxLength(max)))
const optional = (max: number) =>
  f.field(s.optional(s.string().pipe(maxLength(max))))

export const contactSchema = f.object({
  name: required(100),
  company: optional(100),
  phone: optional(20),
  email: f.field(s.string().pipe(minLength(1), maxLength(100), email())),
  message: required(10000),
  privacyPolicy: f.field(s.literal('on')),
  // honeypot: 人には見えない欄。埋まっていたらボットとみなす
  companyPhone: optional(100),
})

export const contactFieldNames = [
  'name',
  'company',
  'phone',
  'email',
  'message',
  'privacyPolicy',
] as const
export type ContactFieldName = (typeof contactFieldNames)[number]

const requiredMessages: Record<ContactFieldName, string> = {
  name: 'お名前を入力してください',
  company: '',
  phone: '',
  email: 'メールアドレスを入力してください',
  message: 'メッセージを入力してください',
  privacyPolicy: 'プライバシーポリシーへの同意が必要です',
}

export type ContactValues = Partial<Record<ContactFieldName, string>>
export type ContactErrors = Partial<Record<ContactFieldName, string>>

export type ContactParseResult =
  | {
      success: true
      data: Omit<s.InferOutput<typeof contactSchema>, 'privacyPolicy'>
    }
  | { success: false; values: ContactValues; errors: ContactErrors }

/** フォームを検証し、失敗時は欄ごとの（翻訳済み）エラーと入力値を返す */
export function parseContactForm(
  formData: FormData,
  t: Translate,
): ContactParseResult {
  let result = s.parseSafe(contactSchema, formData, {
    errorMap(context) {
      let field = context.path?.[0] as ContactFieldName | undefined
      if (context.code === 'string.max_length') {
        let { max } = context.values as { max: number }
        return t('{max}文字以内で入力してください', { max })
      }
      if (context.code === 'string.email') {
        return t('正しいメールアドレスを入力してください')
      }
      if (field && requiredMessages[field]) {
        return t(requiredMessages[field])
      }
      return undefined
    },
  })

  if (result.success) {
    let { privacyPolicy: _, ...data } = result.value
    return { success: true, data }
  }

  let errors: ContactErrors = {}
  for (let issue of result.issues) {
    let field = issue.path?.[0] as ContactFieldName | undefined
    if (field && !errors[field]) errors[field] = issue.message
  }
  return { success: false, values: readValues(formData), errors }
}

function readValues(formData: FormData): ContactValues {
  let values: ContactValues = {}
  for (let name of contactFieldNames) {
    let value = formData.get(name)
    if (typeof value === 'string') values[name] = value
  }
  return values
}
