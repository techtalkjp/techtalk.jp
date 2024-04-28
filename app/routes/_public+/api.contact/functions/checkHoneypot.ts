import { err, ok, type Result } from 'neverthrow'
import type { ContactFormData, HoneypotError } from '../types'

export const checkHoneypot = (
  form: ContactFormData,
): Result<ContactFormData, HoneypotError> => {
  if (form.companyPhone) {
    console.log('honeypot', form.companyPhone)
    return err({ type: 'HoneypotError', message: 'Honeypot detected' })
  }
  return ok(form)
}
