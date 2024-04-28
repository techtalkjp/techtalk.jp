import { err, ok } from 'neverthrow'
import type { ContactFormData } from '../types'

export const checkHoneypot = (form: ContactFormData) => {
  if (form.companyPhone) {
    console.log('honeypot', form.companyPhone)
    return err('honeypot')
  }
  return ok(form)
}
