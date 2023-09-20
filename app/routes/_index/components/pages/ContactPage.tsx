import { Heading } from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import CoverPage from '~/routes/_index/components/CoverPage'
import { ContactForm } from '~/routes/api.contact'

export const ContactPage = () => {
  const { t } = useLocale()

  return (
    <CoverPage id="contact" bgImage="/images/contact.webp">
      <Heading>{t('contact.title', 'お問い合わせ')}</Heading>

      <ContactForm className="mt-4 text-left" />
    </CoverPage>
  )
}
