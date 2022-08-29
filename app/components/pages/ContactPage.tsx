import { Heading } from '@chakra-ui/react'
import { ContactForm } from '~/features/contact/components/ContactForm'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import CoverPage from '../CoverPage'
import PrivacyPolicyDialog from '../PrivacyPolicyDialog'

export const ContactPage = () => {
  const { t } = useLocale()

  return (
    <CoverPage id="contact" bgImage="/images/contact.webp">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        {t('contact.title', 'お問い合わせ')}
      </Heading>

      <ContactForm privacyPolicy={<PrivacyPolicyDialog />}></ContactForm>
    </CoverPage>
  )
}
