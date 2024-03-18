import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { Link, useFetcher } from '@remix-run/react'
import { z } from 'zod'
import PrivacyPolicyDialog from '~/components/PrivacyPolicyDialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  HStack,
  Input,
  Label,
  Stack,
  Textarea,
} from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { sendEmail } from '~/services/sendEmail'
import { sendSlack } from '~/services/sendSlack'

export const schema = z.object({
  name: z.string().max(100),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().max(100).email(),
  message: z.string().max(10000),
  companyPhone: z.string().max(20).optional(),
  privacyPolicy: z.string().transform((value) => value === 'on'),
  locale: z.string(),
})

export type ContactFormData = z.infer<typeof schema>

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
    return json(submission.reply())
  }

  try {
    if (submission.value.companyPhone) {
      // honeypot
      console.log('honeypot', submission.value.companyPhone)
      return json(submission.reply())
    }

    if (submission.value.email !== 'test@example.com') {
      await sendEmail(submission.value)
      await sendSlack(buildContactMessage(submission.value))
    }

    return json(submission.reply())
  } catch (e: unknown) {
    console.log(e)
    return json(submission.reply({ formErrors: [String(e)] }))
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

type ContactFormProps = React.HTMLAttributes<HTMLFormElement>
export const ContactForm = ({ children, ...rest }: ContactFormProps) => {
  const { t, locale } = useLocale()
  const fetcher = useFetcher<typeof action>()
  const lastResult = fetcher.data
  const [
    form,
    { name, company, phone, email, message, companyPhone, privacyPolicy },
  ] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  })

  if (lastResult?.status === 'success' && lastResult.initialValue) {
    return <ContactSentMessage data={lastResult.initialValue} />
  }

  return (
    <fetcher.Form
      method="POST"
      action="/api/contact"
      {...rest}
      {...getFormProps(form)}
    >
      <Stack className="text-left">
        <div>
          <Label htmlFor={name.id}>{t('contact.name', 'お名前')}</Label>
          <Input
            className="bg-black bg-opacity-50"
            autoComplete="name"
            {...getInputProps(name, { type: 'text' })}
          />
          <div id={name.errorId} className="text-red-500">
            {name.errors}
          </div>
        </div>

        <div>
          <Label htmlFor={company.id}>{t('contact.company', '会社名')}</Label>
          <Input
            className="bg-black bg-opacity-50"
            autoComplete="organization"
            {...getInputProps(company, { type: 'text' })}
          />
          <div id={company.errorId} className="text-red-500">
            {company.errors}
          </div>
        </div>

        <div>
          <Label htmlFor={phone.id}>{t('contact.phone', '電話番号')}</Label>
          <Input
            className="bg-black bg-opacity-50"
            autoComplete="tel"
            {...getInputProps(phone, { type: 'tel' })}
          />
          <div id={phone.errorId} className="text-red-500">
            {phone.errors}
          </div>
        </div>

        <div>
          <Label htmlFor={email.id}> {t('contact.email', 'メール')} </Label>
          <Input
            className="bg-black bg-opacity-50"
            autoComplete="email"
            {...getInputProps(email, { type: 'email' })}
          />
          <div id={email.errorId} className="text-red-500">
            {email.errors}
          </div>
        </div>

        <div>
          <Label htmlFor={message.id}>
            {t('contact.message', 'メッセージ')}
          </Label>
          <Textarea
            className="bg-black bg-opacity-50"
            autoComplete="off"
            {...getTextareaProps(message)}
          />
          <div id={message.errorId} className="text-red-500">
            {message.errors}
          </div>
        </div>

        <input type="hidden" name="locale" value={locale} />
        <div className="hidden">
          <input {...getInputProps(companyPhone, { type: 'tel' })} />
        </div>

        <div>
          <HStack className="items-center">
            <Checkbox
              id={privacyPolicy.id}
              key={privacyPolicy.key}
              defaultChecked={privacyPolicy.initialValue === 'on'}
              aria-invalid={privacyPolicy.errors ? true : undefined}
              aria-describedby={
                privacyPolicy.errors ? privacyPolicy.errorId : undefined
              }
              defaultValue="on"
              aria-label="privacy"
            />
            <label htmlFor={privacyPolicy.id} className="cursor-pointer">
              <PrivacyPolicyDialog />
            </label>
          </HStack>
          <div id={privacyPolicy.errorId} className="text-red-500">
            {privacyPolicy.errors}
          </div>
        </div>

        {form.errors && (
          <Alert variant="destructive">
            <AlertTitle>System Error</AlertTitle>
            <AlertDescription>{form.errors}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={fetcher.state === 'submitting'}>
          Let's talk
        </Button>
      </Stack>
    </fetcher.Form>
  )
}
