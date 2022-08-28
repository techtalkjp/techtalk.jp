import { VStack } from '@chakra-ui/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm } from 'remix-validated-form'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { FormInput, FormTextarea, FormSubmitButton } from '~/components/form'
import { ContactFormSchema } from '~/features/contact/schemas/contact-form'

interface ContactFormProps {
  privacyPolicy: React.ReactNode
}
export const ContactForm = ({ privacyPolicy }: ContactFormProps) => {
  const { t, locale } = useLocale()

  return (
    <ValidatedForm
      validator={withZod(ContactFormSchema)}
      action="/thanks"
      method="post"
      noValidate
    >
      <VStack>
        <FormInput name="name" label={t('contact.name', 'お名前')} />
        <FormInput name="company" label={t('contact.company', 'お名前')} />
        <FormInput name="phone" label={t('contact.phone', '電話番号')} />
        <FormInput name="email" label={t('contact.email', 'メール')} />
        <FormTextarea
          name="message"
          label={t('contact.message', 'メッセージ')}
        />
        <input type="hidden" name="locale" value={locale} />

        {privacyPolicy}
        <FormSubmitButton />
      </VStack>
    </ValidatedForm>
  )
}
