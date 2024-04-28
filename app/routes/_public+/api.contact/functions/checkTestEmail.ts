import { err, ok, type Result } from 'neverthrow'
import type { ContactFormData } from '../types'

type TestEmailError = { type: 'TestEmailError'; message: string }
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
