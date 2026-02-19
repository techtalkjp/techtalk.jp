import { Menu } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '~/components/theme-toggle'
import LanguageSwitcher from '~/i18n/components/LanguageSwitcher'
import { useLocale } from '~/i18n/hooks/useLocale'

interface NavigationProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void
}

export function Navigation({ onNavigate }: NavigationProps) {
  const { t } = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    setIsMenuOpen(false)
    onNavigate(e, id)
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-[#020617]/80">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          onClick={(e) => handleNavigate(e, 'top')}
          className="flex items-center gap-2 text-xl font-bold tracking-tighter text-slate-900 dark:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-900 text-sm font-black text-white dark:bg-white dark:text-black">
            TT
          </span>
          TechTalk
        </a>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-400">
          <a
            href="#top"
            onClick={(e) => handleNavigate(e, 'top')}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            {t('nav.top', 'Top')}
          </a>
          <a
            href="#services"
            onClick={(e) => handleNavigate(e, 'services')}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            {t('nav.services', 'Services')}
          </a>
          <a
            href="#profile"
            onClick={(e) => handleNavigate(e, 'profile')}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            {t('nav.profile', 'Profile')}
          </a>
          <a
            href="#company"
            onClick={(e) => handleNavigate(e, 'company')}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            {t('nav.company', 'Company')}
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavigate(e, 'contact')}
            className="rounded-full border border-slate-300 bg-slate-900 px-5 py-2 font-semibold text-white transition-colors hover:bg-slate-800 dark:border-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-100"
          >
            {t('nav.contact', 'Contact')}
          </a>
          <ThemeToggle />
          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="p-2 text-slate-900 md:hidden dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={t('nav.menu.toggle', 'メニューを開く')}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          <Menu />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <nav
          id="mobile-nav"
          className="animate-in slide-in-from-top-5 absolute top-20 left-0 flex w-full flex-col gap-6 border-b border-slate-200 bg-white p-6 text-center shadow-2xl duration-200 md:hidden dark:border-slate-800 dark:bg-[#020617]"
        >
          <a
            href="#top"
            onClick={(e) => handleNavigate(e, 'top')}
            className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {t('nav.top', 'Top')}
          </a>
          <a
            href="#services"
            onClick={(e) => handleNavigate(e, 'services')}
            className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {t('nav.services', 'Services')}
          </a>
          <a
            href="#profile"
            onClick={(e) => handleNavigate(e, 'profile')}
            className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {t('nav.profile', 'Profile')}
          </a>
          <a
            href="#company"
            onClick={(e) => handleNavigate(e, 'company')}
            className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {t('nav.company', 'Company')}
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavigate(e, 'contact')}
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            {t('nav.contact', 'Contact')}
          </a>
          <div className="flex items-center justify-center gap-4 pt-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  )
}
