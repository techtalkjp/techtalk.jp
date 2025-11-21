import { Check, Copy, Facebook } from 'lucide-react'
import { useLocale } from '~/i18n/hooks/useLocale'

interface ContactSectionProps {
  showCopyFeedback: boolean
  onCopyEmail: () => void
}

export function ContactSection({
  showCopyFeedback,
  onCopyEmail,
}: ContactSectionProps) {
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

        <div className="inline-block w-full max-w-2xl rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-8 shadow-2xl md:p-12 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <p className="mb-4 font-mono text-sm text-slate-500 dark:text-slate-500">
            {t('contact.email.label', 'EMAIL')}
          </p>
          <a
            href="mailto:contact@techtalk.jp"
            className="font-mono text-2xl font-bold tracking-tight break-all text-slate-900 transition-colors hover:text-blue-600 md:text-4xl dark:text-white dark:hover:text-blue-400"
          >
            contact@techtalk.jp
          </a>
          <div className="mt-8">
            <button
              type="button"
              onClick={onCopyEmail}
              className="group inline-flex cursor-pointer items-center gap-2 rounded border border-slate-300 px-5 py-2.5 text-sm text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {showCopyFeedback ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    {t('contact.copy.success', 'Copied!')}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  {t('contact.copy.button', 'メールアドレスをコピー')}
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-full bg-slate-200 dark:bg-slate-800/50" />

          {/* Messenger Section */}
          <p className="mb-4 font-mono text-sm text-slate-500 dark:text-slate-500">
            {t('contact.messenger.label', 'MESSENGER')}
          </p>
          <a
            href="https://m.me/mizoguchi.coji"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-xl font-bold text-slate-900 transition-colors hover:text-blue-600 md:text-2xl dark:text-white dark:hover:text-blue-400"
          >
            <Facebook className="h-6 w-6 text-blue-500 transition-colors group-hover:text-blue-600 md:h-8 md:w-8 dark:group-hover:text-blue-400" />
            <span>mizoguchi.coji</span>
          </a>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
            {t(
              'contact.messenger.description',
              'Facebook Messengerでもお気軽にご連絡ください',
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
