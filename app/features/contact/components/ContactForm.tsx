import { VStack } from '@chakra-ui/react'
import { useFetcher } from '@remix-run/react'
import { ValidatedForm } from 'remix-validated-form'
import { ContactSentMessage } from '~/features/contact/components/ContactSentMessage'
import { validator } from '~/features/contact/schemas/contact-form'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { FormInput } from './FormInput'
import { FormSubmitButton } from './FormSubmitButton'
import { FormTextarea } from './FormTextarea'

interface ContactFormProps {
  privacyPolicy: React.ReactNode
}
export const ContactForm = ({ privacyPolicy }: ContactFormProps) => {
  const { t, locale } = useLocale()
  const fetcher = useFetcher()

  if (fetcher.type === 'done' && fetcher.data.error) {
    return <div>error!{JSON.stringify(fetcher.data)}</div>
  }

  if (fetcher.type === 'done' && fetcher.data.data) {
    return (
      <VStack>
        <ContactSentMessage data={fetcher.data.data}></ContactSentMessage>
      </VStack>
    )
  }

  return (
    <ValidatedForm
      fetcher={fetcher}
      validator={validator}
      onSubmit={(data, event) => {
        event.preventDefault()
        fetcher.submit(data, {
          method: 'post',
          action: '/api/contact'
        })
      }}
      noValidate
    >
      <VStack>
        <FormInput name="name" label={t('contact.name', 'お名前')} />
        <FormInput name="company" label={t('contact.company', '会社名')} />
        <FormInput name="phone" label={t('contact.phone', '電話番号')} />
        <FormInput name="email" label={t('contact.email', 'メール')} />
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
