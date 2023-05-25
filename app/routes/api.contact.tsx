import { json, type ActionArgs } from '@vercel/remix'
import { validationError } from 'remix-validated-form'
import type { ContactFormData } from '~/features/contact/schemas/contact-form'
import { validator } from '~/features/contact/schemas/contact-form'
import { sendEmail } from '~/features/contact/utils/sendEmail'
import { sendSlack } from '~/features/contact/utils/sendSlack'

export const isSucceed = (
  data: unknown,
): data is { isDone: true; formData: ContactFormData } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'isDone' in data &&
    data.isDone === true
  )
}

export const action = async ({ request }: ActionArgs) => {
  const { data, error } = await validator.validate(await request.formData())
  if (error) return validationError(error)

  try {
    if (data.email !== 'test@example.com') {
      // テスト用
      await sendEmail(data)
      await sendSlack(data)
    }
    return json({ isDone: true, formData: data satisfies ContactFormData })
  } catch (e: unknown) {
    console.log(e)
    throw new Response(String(e), { status: 500 })
  }
}
