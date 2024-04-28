import { err, ok, type Result } from 'neverthrow'
import type { ContactFormData, TestEmailError } from '../types'

export const checkTestEmail = (
  form: ContactFormData,
): Result<ContactFormData, TestEmailError> => {
  if (form.email === 'test@example.com') {
    console.log('testEmail', form.email)
    return err({
      type: 'TestEmailError',
      message: `testEmail detected: ${form.email}`,
    })
  }
  return ok(form)
}
