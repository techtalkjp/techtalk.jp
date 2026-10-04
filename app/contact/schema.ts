import * as s from 'remix/data-schema'
import { maxLength, minLength } from 'remix/data-schema/checks'
import * as f from 'remix/data-schema/form-data'

import type { MessageKey, Translate } from '../i18n/index.ts'

/** 入力欄の文字数上限。サーバーの検証とフォームの maxLength で共有する */
export const contactLimits = {
  name: 100,
  company: 100,
  email: 100,
  message: 10000,
} as const

/**
 * メールアドレスの形式。remix/data-schema の email() は `a@b.c` や `x>y@example.com` も通すので、
 * ローカル部は RFC 5322 の atext をドットでつないだもの（先頭・末尾・連続のドットは不可）、ドメインは英数字とハイフンのラベル、
 * 最後のラベルは 2 文字以上の英字に限る（メール送信で壊れる文字を入れさせない）
 */
const ATEXT = "[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+"
const EMAIL_PATTERN = new RegExp(
  `^${ATEXT}(?:\\.${ATEXT})*@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}$`,
)
const email = (): s.Check<string> => ({
  check: (value) => EMAIL_PATTERN.test(value),
  code: 'string.email',
  message: 'Expected valid email',
})

// 改行を LF にそろえ、前後の空白を除いてから検証する。ブラウザは改行を CRLF で送るので、
// そのまま数えると textarea の maxLength より長くなる。空白だけの入力も通さない
// 本文全体は contactFormData() で 256KB までに絞ってあり、変換はどれも線形時間なので、
// 長い入力でも CPU を使い切らない
const trimmed = () =>
  s.string().transform((value) => value.replace(/\r\n?/g, '\n').trim())
const required = (max: number) =>
  f.field(trimmed().pipe(minLength(1), maxLength(max)))
// 1 行の欄。改行類（LF、VT、FF、NEL、LS、PS）はメールの件名などに入ると困るので空白にする。
// 正規表現の繰り返しを使わず、行ごとに切って詰めるので長い入力でも線形時間で済む
const LINE_BREAKS = /[\n\v\f\u0085\u2028\u2029]/
const singleLine = () =>
  trimmed().transform((value) =>
    value
      .split(LINE_BREAKS)
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .join(' '),
  )
const requiredLine = (max: number) =>
  f.field(singleLine().pipe(minLength(1), maxLength(max)))
// 空欄は undefined にそろえる（従来どおり評価ログでは NULL になる）
const optional = (max: number) =>
  f.field(
    s
      .optional(singleLine().pipe(maxLength(max)))
      .transform((value) => value || undefined),
  )

export const contactSchema = f.object({
  name: requiredLine(contactLimits.name),
  company: optional(contactLimits.company),
  email: f.field(
    singleLine().pipe(minLength(1), maxLength(contactLimits.email), email()),
  ),
  message: required(contactLimits.message),
  privacyPolicy: f.field(s.literal('on')),
})

export const contactFieldNames = [
  'name',
  'company',
  'email',
  'message',
  'privacyPolicy',
] as const
export type ContactFieldName = (typeof contactFieldNames)[number]

// 必須でない会社名だけを外す。新しい項目を足したら、ここにメッセージを書くか外すかを決める
const requiredMessages: Record<
  Exclude<ContactFieldName, 'company'>,
  MessageKey
> = {
  name: 'お名前を入力してください',
  email: 'メールアドレスを入力してください',
  message: '相談内容を入力してください',
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
      if (field && field !== 'company') {
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
