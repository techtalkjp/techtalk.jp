import { Heading } from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import CoverPage from '~/routes/_public+/_index/components/CoverPage'
import { ContactForm } from '~/routes/_public+/api.contact'

export const ContactPage = ({ className }: React.ComponentProps<'div'>) => {
  const { t } = useLocale()

  return (
    <CoverPage
      id="contact"
      bgImage="/images/contact.webp"
      className={className}
    >
      <Heading className="scroll-fade-in">
        {t('contact.title', 'お問い合わせ')}
      </Heading>

      <ContactForm className="scroll-fade-in mx-auto mt-4 max-w-md" />
    </CoverPage>
  )
}
