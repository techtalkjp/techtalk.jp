import type { APIRoute } from 'astro'
import { email, flatten, literal, maxLength, minLength, object, optional, safeParse, string, type Input } from 'valibot'
import { sendEmail } from '~/services/sendEmail'
import { sendSlack } from '~/services/sendSlack'

export const prerender = false

export const ContactFormSchema = object({
  name: string([minLength(1, 'required'), maxLength(200, 'too long')]),
  company: optional(string([maxLength(200, 'too long')])),
  tel: optional(string([maxLength(200)])),
  email: string([minLength(1, 'required'), email('invalid email')]),
  message: string([minLength(1, 'required'), maxLength(2000)]),
  privacy: literal('on', 'You must agree to the privacy policy'),
})

export type ContactFormData = Input<typeof ContactFormSchema>

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()
  const result = safeParse(ContactFormSchema, data)

  if (result.success) {
    await sendEmail(result.output)
    await sendSlack(JSON.stringify(result.output, null, 2))
    return new Response(JSON.stringify(result))
  } else {
    return new Response(
      JSON.stringify({
        success: false,
        errors: flatten(result.issues).nested,
      }),
      { status: 422 },
    )
  }
}
