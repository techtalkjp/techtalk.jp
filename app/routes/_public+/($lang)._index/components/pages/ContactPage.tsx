import { Heading } from '~/components/typography'
import { useLocale } from '~/i18n/hooks/useLocale'
import CoverPage from '~/routes/_public+/($lang)._index/components/CoverPage'
import { ContactForm } from '~/routes/_public+/api.contact/route'

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
