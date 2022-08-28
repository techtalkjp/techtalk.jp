import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { ContactSentMessage } from '~/features/contact/components/ContactSentMessage'
import type { ContactFormData } from '~/features/contact/interfaces/ContactFormData'
import { withZod } from '@remix-validated-form/with-zod'
import { ContactFormSchema } from '~/features/contact/schemas/contact-form'

const validator = withZod(ContactFormSchema)

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const { data, error } = await validator.validate(formData)

  return json({ data, error })
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

export default async function Thanks() {
  const ret = useActionData<typeof action>()
  if (!ret) return <div>error</div>

  return <div>{ret.data && <ContactSentMessage data={ret.data} />}</div>
}
