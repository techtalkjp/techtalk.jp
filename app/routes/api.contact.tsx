import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Link, useFetcher } from '@remix-run/react'
import { json, type ActionFunctionArgs } from '@vercel/remix'
import { z } from 'zod'
import PrivacyPolicyDialog from '~/components/PrivacyPolicyDialog'
import { Button, Checkbox, HStack, Input, Label, Stack, Textarea } from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { sendEmail } from '~/services/sendEmail'
import { sendSlack } from '~/services/sendSlack'

export const schema = z.object({
  name: z.string().max(100),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().max(100).email(),
  message: z.string().max(10000),
  privacyPolicy: z.string().transform((value) => value === 'on'),
  locale: z.string(),
})

export type ContactFormData = z.infer<typeof schema>

export const isSucceed = (data: unknown): data is { isDone: true; formData: ContactFormData } => {
  return typeof data === 'object' && data !== null && 'isDone' in data && data.isDone === true
}

export const buildContactMessage = (data: ContactFormData) => {
  return `お名前: ${data.name}
会社名: ${data.company}
電話番号: ${data.phone}
メールアドレス: ${data.email}
メッセージ: ${data.message}`
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    if (submission.value.email !== 'test@example.com') {
      await sendEmail(submission.value)
      await sendSlack(buildContactMessage(submission.value))
    }

    return json({
      isDone: true,
      formData: submission.value satisfies ContactFormData,
    })
  } catch (e: unknown) {
    console.log(e)
    throw new Response(String(e), { status: 500 })
  }
}

interface ContactSentMessageProps {
  data: Partial<ContactFormData>
}

export const ContactSentMessage = ({ data }: ContactSentMessageProps) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4">
      <div>
        お問い合わせありがとうございます。
        <br />
        以下のメッセージを受付けました。
        <br />
        お返事をお待ち下さい。
      </div>

      <div className="grid grid-cols-2 justify-items-start gap-4 rounded bg-black bg-opacity-50 p-4">
        <div>お名前</div>
        <div>{data.name}</div>
        <div>会社名</div>
        <div>{data.company}</div>
        <div>電話番号</div>
        <div>{data.phone}</div>
        <div>メールアドレス</div>
        <div>{data.email}</div>
        <div>メッセージ</div>
        <div>{data.message}</div>
      </div>

      <Link to="." reloadDocument>
        <Button>OK</Button>
      </Link>
    </div>
  )
}

interface ContactFormProps extends React.HTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode
}
export const ContactForm = ({ children, ...rest }: ContactFormProps) => {
  const { t, locale } = useLocale()
  const fetcher = useFetcher<typeof action>()
  const [form, { name, company, phone, email, message, privacyPolicy }] = useForm({
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  if (fetcher.data && isSucceed(fetcher.data)) {
    return <ContactSentMessage data={fetcher.data.formData} />
  }

  return (
    <fetcher.Form method="POST" action="/api/contact" {...getFormProps(form)} {...rest}>
      <Stack className="text-left">
        <div>
          <Label htmlFor={name.id}>{t('contact.name', 'お名前')}</Label>
          <Input className="bg-black bg-opacity-50" autoComplete="name" {...getInputProps(name, { type: 'text' })} />
          <div className="text-red-500">{name.errors}</div>
        </div>

        <div>
          <Label htmlFor={company.id}>{t('contact.company', '会社名')}</Label>
          <Input
            className="bg-black bg-opacity-50"
            autoComplete="organization"
            {...getInputProps(company, { type: 'text' })}
          />
          <div className="text-red-500">{company.errors}</div>
        </div>

        <div>
          <Label htmlFor={phone.id}>{t('contact.phone', '電話番号')}</Label>
          <Input className="bg-black bg-opacity-50" autoComplete="tel" {...getInputProps(phone, { type: 'tel' })} />
          <div className="text-red-500">{phone.errors}</div>
        </div>

        <div>
          <Label htmlFor={email.id}> {t('contact.email', 'メール')} </Label>
          <Input className="bg-black bg-opacity-50" autoComplete="email" {...getInputProps(email, { type: 'email' })} />
          <div className="text-red-500">{email.errors}</div>
        </div>

        <div>
          <Label htmlFor={message.id}>{t('contact.message', 'メッセージ')}</Label>
          <Textarea className="bg-black bg-opacity-50" autoComplete="off" {...getTextareaProps(message)} />
          <div className="text-red-500">{message.errors}</div>
        </div>

        <input type="hidden" name="locale" value={locale} />

        <div>
          <HStack>
            <Checkbox id={privacyPolicy.id} name={privacyPolicy.name} value="on" />
            <label htmlFor={privacyPolicy.id} className="cursor-pointer">
              <PrivacyPolicyDialog />
            </label>
          </HStack>
          <div className="text-red-500">{privacyPolicy.errors}</div>
        </div>

        <Button type="submit" disabled={fetcher.state === 'submitting'}>
          Let's talk
        </Button>
      </Stack>
    </fetcher.Form>
  )
}
