import { useLocale } from '~/i18n/hooks/useLocale'

interface Career {
  period: string
  title: string
  description: string
}

interface CareerTimelineProps {
  careers: Career[]
}

export function CareerTimeline({ careers }: CareerTimelineProps) {
  const { t } = useLocale()
  return (
    <section className="border-t border-slate-200 py-24 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="animate-on-scroll translate-y-5 opacity-0 transition-all duration-700">
            <h2 className="mb-12 text-sm font-semibold tracking-wider text-slate-500 dark:text-white/50">
              {t('bio.career.title', 'CAREER')}
            </h2>
          </div>

          <div className="space-y-8">
            {careers.map((career, index) => (
              <div
                key={career.title}
                className="animate-on-scroll translate-y-5 opacity-0 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/[0.07]">
                  <div className="mb-2 text-sm text-slate-500 dark:text-white/50">
                    {career.period}
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-slate-900 transition-colors group-hover:text-slate-700 dark:text-white dark:group-hover:text-white/90">
                    {career.title}
                  </h3>
                  <p className="leading-relaxed text-slate-600 dark:text-white/70">
                    {career.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
