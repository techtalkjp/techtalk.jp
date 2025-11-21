import type { useLocale } from '~/i18n/hooks/useLocale'

interface FooterProps {
  t: ReturnType<typeof useLocale>['t']
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-900 dark:bg-[#020617]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-slate-900 text-xs font-black text-white dark:bg-slate-800 dark:text-white">
            TT
          </span>
          {t('footer.company', 'TechTalk Inc.')}
        </div>
        <div className="font-mono text-sm text-slate-500 dark:text-slate-600">
          {t('footer.copyright', '© TechTalk Inc. All Rights Reserved.')}
        </div>
      </div>
    </footer>
  )
}
