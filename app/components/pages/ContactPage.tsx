import { Heading } from '@chakra-ui/react'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { ContactForm } from '~/routes/api.contact'
import CoverPage from '../CoverPage'
import PrivacyPolicyDialog from '../PrivacyPolicyDialog'

export const ContactPage = () => {
  const { t } = useLocale()

  return (
    <CoverPage id="contact" bgImage="/images/contact.webp">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1" mb="4">
        {t('contact.title', 'お問い合わせ')}
      </Heading>

      <ContactForm className="text-left">
        <PrivacyPolicyDialog />
      </ContactForm>
    </CoverPage>
  )
}
