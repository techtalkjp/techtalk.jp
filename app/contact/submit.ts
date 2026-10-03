import type { Translate } from '../i18n/index.ts'
import type { Bindings } from '../middleware/bindings.ts'
import {
  parseContactForm,
  type ContactErrors,
  type ContactValues,
} from './schema.ts'
import { scoreSales } from './score-sales.ts'
import type { ContactInquiry } from './types.ts'

export type ContactSubmitResult =
  | { status: 'sent' }
  | { status: 'invalid'; values: ContactValues; errors: ContactErrors }
  | { status: 'failed'; values: ContactValues }

/**
 * 問い合わせを検証し、ContactWorkflow に積む。
 * honeypot が埋まっていたら、ボットに気づかれないよう送信成功として扱って捨てる。
 */
export async function submitContact(options: {
  formData: FormData
  locale: string
  t: Translate
  workflow: Bindings['contactWorkflow']
}): Promise<ContactSubmitResult> {
  let parsed = parseContactForm(options.formData, options.t)
  if (!parsed.success) {
    return { status: 'invalid', values: parsed.values, errors: parsed.errors }
  }

  let { companyPhone, ...form } = parsed.data
  if (companyPhone) {
    console.log('honeypot', companyPhone)
    return { status: 'sent' }
  }

  let data = { ...form, privacyPolicy: true, locale: options.locale }
  let inquiry: ContactInquiry = { ...data, rule: scoreSales(data) }

  try {
    await options.workflow.create({ params: inquiry })
    return { status: 'sent' }
  } catch (error) {
    console.error('Failed to enqueue contact workflow:', error)
    let { privacyPolicy: _, locale: __, ...values } = data
    return { status: 'failed', values: { ...values, privacyPolicy: 'on' } }
  }
}
