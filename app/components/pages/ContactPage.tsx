import { Heading } from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { ContactForm } from '~/routes/api.contact'
import CoverPage from '../CoverPage'
import PrivacyPolicyDialog from '../PrivacyPolicyDialog'

export const ContactPage = () => {
  const { t } = useLocale()

  return (
    <CoverPage id="contact" bgImage="/images/contact.webp">
      <Heading>{t('contact.title', 'お問い合わせ')}</Heading>

      <ContactForm className="mt-4 text-left">
        <PrivacyPolicyDialog />
      </ContactForm>
    </CoverPage>
  )
}
