import { err, ok, type Result } from 'neverthrow'
import type { ContactFormData } from '../types'

type HoneypotError = { type: 'HoneypotError'; message: string }
export const checkHoneypot = (
  form: ContactFormData,
): Result<ContactFormData, HoneypotError> => {
  if (form.companyPhone) {
    console.log('honeypot', form.companyPhone)
    return err({ type: 'HoneypotError', message: 'Honeypot detected' })
  }
  return ok(form)
}
