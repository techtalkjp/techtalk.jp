import { useLocale } from '~/i18n/hooks/useLocale'

interface BiographyHeroProps {
  mounted: boolean
}

export function BiographyHero({ mounted }: BiographyHeroProps) {
  const { t } = useLocale()
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div
            className={`text-center transition-all duration-1000 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <div className="mb-8 flex justify-center">
              <img
                src="/images/coji.webp"
                alt="Coji Mizoguchi"
                className="h-32 w-32 rounded-full border-4 border-slate-200 dark:border-white/10"
              />
            </div>
            <h1 className="mb-4 text-5xl font-bold text-slate-900 md:text-6xl dark:text-white">
              {t('profile.nameEn', 'Coji Mizoguchi')}
            </h1>
            <p className="mb-8 text-xl text-slate-700 md:text-2xl dark:text-white/70">
              {t('profile.name', '溝口 浩二')}
            </p>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-white/60">
              {t('bio.tagline', '技術と事業の両面から0→1を生み出す')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
