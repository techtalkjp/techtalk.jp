import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { ContactFormData } from '~/features/contact/interfaces/ContactFormData'
import { withZod } from '@remix-validated-form/with-zod'
import { ContactFormSchema } from '~/features/contact/schemas/contact-form'
import { sendSlack } from '~/features/contact/utils/sendSlack'
import { sendEmail } from '~/features/contact/utils/sendEmail'

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

  try {
    await sendSlack(data)
    await sendEmail(data)
    return json<ActionProps>({ data })
  } catch (e: any) {
    return json<ActionProps>(
      {
        data,
        error: [e.toString()]
      },
      { status: 500 }
    )
  }
}
