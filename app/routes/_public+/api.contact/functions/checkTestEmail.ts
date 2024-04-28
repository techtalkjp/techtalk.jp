import { err, ok } from 'neverthrow'
import type { ContactFormData } from '../types'

export const checkTestEmail = (form: ContactFormData) => {
  if (form.email === 'test@example.com') {
    console.log('testEmail', form.email)
    return err(`testEmail: ${form.email}`)
  }
  return ok(form)
}
