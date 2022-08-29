import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { ContactFormData } from '~/features/contact/interfaces/ContactFormData'
import { withZod } from '@remix-validated-form/with-zod'
import { ContactFormSchema } from '~/features/contact/schemas/contact-form'

const validator = withZod(ContactFormSchema)

interface ActionProps {
  data: Partial<ContactFormData>
  error?: string[]
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const { data, error } = await validator.validate(formData)

  if (!data) {
    return json<ActionProps>(
      {
        data: Object.fromEntries(formData),
        error: Object.keys(error.fieldErrors).map((k) => error.fieldErrors[k])
      },
      { status: 500 }
    )
  }

  return json<ActionProps>({
    data
  })
  //  await sendEmail(formData)

  /*
  try {
    await sendSlack(formData)
    await sendEmail(formData)
    return res.status(200).end()
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'error',
        message: error.toString()
      }
    })
  }
  */
}
