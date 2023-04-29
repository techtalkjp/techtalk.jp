import { json, type ActionArgs } from '@vercel/remix'
// import { validationError } from 'remix-validated-form'
import { validator } from '~/features/contact/schemas/contact-form'
import { sendEmail } from '~/features/contact/utils/sendEmail'
import { sendSlack } from '~/features/contact/utils/sendSlack'

export const action = async ({ request }: ActionArgs) => {
  const { data } = await validator.validate(await request.formData())

  if (!data) {
    throw new Response('invalid request', { status: 500 })
  }

  try {
    if (data.email !== 'test@example.com') {
      // テスト用
      await sendEmail(data)
      await sendSlack(data)
    }
    return json({ ...data })
  } catch (e: unknown) {
    console.log(e)
    throw new Response(String(e), { status: 500 })
  }
}
