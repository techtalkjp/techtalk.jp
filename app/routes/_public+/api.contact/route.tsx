import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { ok } from 'neverthrow'
import { Link, useFetcher, type ActionFunctionArgs } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { match } from 'ts-pattern'
import PrivacyPolicyDialog from '~/components/PrivacyPolicyDialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  FormField,
  FormMessage,
  HStack,
  Input,
  Label,
  Stack,
  Textarea,
} from '~/components/ui'
import { useLocale } from '~/i18n/hooks/useLocale'
import { checkHoneypot, enqueue } from './functions.server'
import { schema, type ContactFormData } from './types'

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply(), sent: null }
  }

  const result = await ok(submission.value)
    .andThen(checkHoneypot)
    .asyncAndThen((form) => enqueue({ context, data: form }))

  if (result.isErr()) {
    return match(result.error)
      .with({ type: 'HoneypotError' }, () => ({
        lastResult: submission.reply({ resetForm: true }),
        sent: submission.value,
      }))
      .with({ type: 'EnqueueError' }, (val) => ({
        lastResult: submission.reply({ formErrors: [val.message] }),
        sent: null,
      }))
      .exhaustive()
  }

  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
      sent: submission.value,
    },
    {
      message: 'お問い合わせを受け付けました',
      description: 'お返事をお待ちください',
    },
  )
}

export const ContactSentMessage = ({ data }: { data: ContactFormData }) => {
  return (
    <Stack align="center">
      <div>
        お問い合わせありがとうございます。
        <br />
        以下のメッセージを受付けました。
        <br />
        お返事をお待ち下さい。
      </div>

      <div className="grid max-h-96 w-full max-w-md grid-cols-[auto_1fr] justify-items-start gap-4 overflow-auto rounded bg-black/50 p-4">
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
    </Stack>
  )
}

type ContactFormProps = React.HTMLAttributes<HTMLFormElement>
export const ContactForm = ({ children, ...rest }: ContactFormProps) => {
  const { t, locale: userLocale } = useLocale()
  const fetcher = useFetcher<typeof action>()
  const actionData = fetcher.data
  const [
    form,
    {
      name,
      company,
      phone,
      email,
      message,
      companyPhone,
      privacyPolicy,
      locale,
    },
  ] = useForm({
    defaultValue: {
      locale: userLocale,
    },
    lastResult: actionData?.lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  })

  if (actionData?.sent) {
    return <ContactSentMessage data={actionData.sent} />
  }

  return (
    <fetcher.Form
      method="POST"
      action="/api/contact"
      {...rest}
      {...getFormProps(form)}
    >
      <Stack align="center">
        <FormField>
          <Label htmlFor={name.id}>{t('contact.name', 'お名前')}</Label>
          <Input
            className="bg-black/50"
            autoComplete="name"
            {...getInputProps(name, { type: 'text' })}
          />
          <FormMessage id={name.errorId}>{name.errors}</FormMessage>
        </FormField>

        <FormField>
          <Label htmlFor={company.id}>{t('contact.company', '会社名')}</Label>
          <Input
            className="bg-black/50"
            autoComplete="organization"
            {...getInputProps(company, { type: 'text' })}
          />
          <FormMessage id={company.errorId}>{company.errors}</FormMessage>
        </FormField>

        <FormField>
          <Label htmlFor={phone.id}>{t('contact.phone', '電話番号')}</Label>
          <Input
            className="bg-black/50"
            autoComplete="tel"
            {...getInputProps(phone, { type: 'tel' })}
          />
          <FormMessage id={phone.errorId}>{phone.errors}</FormMessage>
        </FormField>

        <FormField>
          <Label htmlFor={email.id}> {t('contact.email', 'メール')} </Label>
          <Input
            className="bg-black/50"
            autoComplete="email"
            {...getInputProps(email, { type: 'email' })}
          />
          <FormMessage id={email.errorId}>{email.errors}</FormMessage>
        </FormField>

        <FormField>
          <Label htmlFor={message.id}>
            {t('contact.message', 'メッセージ')}
          </Label>
          <Textarea
            className="bg-black/50"
            autoComplete="off"
            {...getTextareaProps(message)}
          />
          <FormMessage id={message.errorId}>{message.errors}</FormMessage>
        </FormField>

        <div className="hidden">
          <input {...getInputProps(companyPhone, { type: 'tel' })} />
        </div>

        <FormField>
          <HStack>
            <Checkbox
              id={privacyPolicy.id}
              name={privacyPolicy.name}
              aria-invalid={privacyPolicy.errors ? true : undefined}
              aria-describedby={
                privacyPolicy.errors ? privacyPolicy.errorId : undefined
              }
              defaultChecked={privacyPolicy.initialValue === 'on'}
              aria-label="privacy"
            />
            <Label htmlFor={privacyPolicy.id} className="cursor-pointer">
              <PrivacyPolicyDialog />
            </Label>
          </HStack>
          <FormMessage id={privacyPolicy.errorId}>
            {privacyPolicy.errors}
          </FormMessage>
        </FormField>

        <input {...getInputProps(locale, { type: 'hidden' })} />

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
