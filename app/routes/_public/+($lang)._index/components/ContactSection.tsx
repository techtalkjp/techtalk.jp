import { useLocale } from '~/i18n/hooks/useLocale'
import { ContactForm } from '~/routes/_public/api.contact'

export function ContactSection() {
  const { t } = useLocale()
  return (
    <section
      id="contact"
      className="border-t border-slate-200 py-24 dark:border-slate-900"
    >
      <div className="fade-in-section mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">
          {t('contact.heading', 'お問い合わせ')}
        </h2>
        <p className="mb-12 leading-relaxed text-slate-600 dark:text-slate-400">
          {t(
            'contact.description.line1',
            '技術実装、プロジェクト推進、技術顧問など、どのような形でのご相談も受け付けています。',
          )}
          <br />
          {t(
            'contact.description.line2',
            '抱えている課題と期待する成果をお聞かせください。',
          )}
        </p>

        {/* Contact Form */}
        <div className="mx-auto max-w-lg text-left">
          <ContactForm className="space-y-4" />
        </div>
      </div>
    </section>
  )
}
