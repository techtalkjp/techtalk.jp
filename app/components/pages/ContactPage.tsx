import { Heading, VStack } from '@chakra-ui/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm } from 'remix-validated-form'
import { useLocale } from '~/hooks/useLocale'
import CoverPage from '../CoverPage'
import { FormInput, FormTextarea, FormSubmitButton } from '../form'

import PrivacyPolicyDialog from '../PrivacyPolicyDialog'
import { ContactFormSchema } from '~/schemas/contact-form'

export const ContactPage = () => {
  const { t } = useLocale()

  return (
    <CoverPage id="contact" bgImage="/contact.jpg">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        {t('contact.title', 'お問い合わせ')}
      </Heading>

      <ValidatedForm validator={withZod(ContactFormSchema)} method="post">
        <VStack>
          <FormInput name="name" label={t('contact.name', 'お名前')} />
          <FormInput name="company" label={t('contact.company', 'お名前')} />
          <FormInput name="phone" label={t('contact.phone', '電話番号')} />
          <FormInput name="email" label={t('contact.email', 'メール')} />
          <FormTextarea
            name="message"
            label={t('contact.message', 'メッセージ')}
          />

          <PrivacyPolicyDialog />
          <FormSubmitButton />
        </VStack>
      </ValidatedForm>
    </CoverPage>
  )
}
