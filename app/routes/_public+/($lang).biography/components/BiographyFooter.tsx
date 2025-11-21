import { useLocale } from '~/i18n/hooks/useLocale'

export function BiographyFooter() {
  const { t } = useLocale()
  return (
    <footer className="border-t border-slate-200 py-12 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="text-center text-sm text-slate-500 dark:text-white/50">
          {t('footer.copyright', '© TechTalk Inc. All Rights Reserved.')}
        </div>
      </div>
    </footer>
  )
}
