import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { ThemeToggle } from '~/components/theme-toggle'
import { useLocale } from '~/i18n/hooks/useLocale'

export function BiographyNavigation() {
  const { t, locale } = useLocale()
  return (
    <nav className="border-b border-slate-200 dark:border-white/10">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to={locale === 'en' ? '/en' : '/'}
          className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('bio.back', 'トップへ戻る')}
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}
