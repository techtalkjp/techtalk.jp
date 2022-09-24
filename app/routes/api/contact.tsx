import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { ContactFormData } from '~/features/contact/interfaces/ContactFormData'
import { validationError } from 'remix-validated-form'
import { validator } from '~/features/contact/schemas/contact-form'
import { sendSlack } from '~/features/contact/utils/sendSlack'
import { sendEmail } from '~/features/contact/utils/sendEmail'

interface ActionProps {
  data?: ContactFormData
  error?: string[]
}

export const action = async ({ request }: ActionArgs) => {
  const { data, error, submittedData } = await validator.validate(
    await request.formData()
  )

  if (error) {
    return validationError(error, submittedData)
  }

  try {
    // await sendSlack(data)
    await sendEmail(data)
    return json<ActionProps>({ data })
  } catch (e: any) {
    return json<ActionProps>(
      {
        error: [e.toString()]
      },
      { status: 500 }
    )
  }
}
