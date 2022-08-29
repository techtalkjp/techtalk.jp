import { VStack } from '@chakra-ui/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm } from 'remix-validated-form'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { FormInput, FormTextarea, FormSubmitButton } from '~/components/form'
import { ContactFormSchema } from '~/features/contact/schemas/contact-form'
import { useFetcher } from '@remix-run/react'
import { ContactSentMessage } from '~/features/contact/components/ContactSentMessage'

interface ContactFormProps {
  privacyPolicy: React.ReactNode
}
export const ContactForm = ({ privacyPolicy }: ContactFormProps) => {
  const { t, locale } = useLocale()
  const fetcher = useFetcher()

  if (fetcher.type === 'done' && fetcher.data.error) {
    return <div>error: {JSON.stringify(fetcher.data.error)}</div>
  }

  if (fetcher.type === 'done') {
    return (
      <VStack>
        <ContactSentMessage data={fetcher.data.data}></ContactSentMessage>
      </VStack>
    )
  }

  return (
    <ValidatedForm
      validator={withZod(ContactFormSchema)}
      onSubmit={(data) => {
        fetcher.submit(data, {
          method: 'post',
          action: '/thanks'
        })
      }}
      noValidate
    >
      <VStack>
        <FormInput name="name" label={t('contact.name', 'お名前')} />
        <FormInput name="company" label={t('contact.company', 'お名前')} />
        <FormInput name="phone" label={t('contact.phone', '電話番号')} />
        {<FormInput name="email" label={t('contact.email', 'メール')} />}
        <FormTextarea
          name="message"
          label={t('contact.message', 'メッセージ')}
        />
        <input type="hidden" name="locale" value={locale} />

        {privacyPolicy}

        <FormSubmitButton state={fetcher.state} />
      </VStack>
    </ValidatedForm>
  )
}
