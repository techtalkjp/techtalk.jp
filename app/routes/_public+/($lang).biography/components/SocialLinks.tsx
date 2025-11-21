import { Facebook, Github, Twitter } from 'lucide-react'
import { useLocale } from '~/i18n/hooks/useLocale'

export function SocialLinks() {
  const { t } = useLocale()
  return (
    <section className="border-t border-slate-200 py-12 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="animate-on-scroll translate-y-5 opacity-0 transition-all duration-700">
            <h2 className="mb-6 text-sm font-semibold tracking-wider text-slate-500 dark:text-white/50">
              {t('bio.social.title', 'CONNECT')}
            </h2>
            <div className="flex gap-4">
              <a
                href="https://x.com/techtalkjp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Twitter className="h-5 w-5" />
                <span>X</span>
              </a>
              <a
                href="https://www.facebook.com/mizoguchi.coji"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
              <a
                href="https://github.com/coji"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
