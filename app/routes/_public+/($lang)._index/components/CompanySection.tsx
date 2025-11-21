import { Building2, Compass, Layers, Sparkles, User } from 'lucide-react'
import { useLocale } from '~/i18n/hooks/useLocale'

export function CompanySection() {
  const { t } = useLocale()
  return (
    <section
      id="company"
      className="fade-in-section border-t border-slate-200 py-24 dark:border-slate-900"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
            {t('company.heading', '会社概要')}
          </h2>
        </div>

        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 backdrop-blur-sm md:p-12 dark:border-slate-800 dark:bg-slate-900/40">
          <dl className="space-y-6">
            <div className="flex items-start gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <Building2 className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('company.name.label', '会社名')}
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {t('company.name.value', '株式会社TechTalk')}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('company.representative.label', '代表取締役')}
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {t('company.representative.value', '溝口 浩二')}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <Compass className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('company.established.label', '設立')}
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {t('company.established.value', '2019年7月')}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <Layers className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('company.address.label', '所在地')}
                </dt>
                <dd className="text-lg leading-relaxed font-medium text-slate-900 dark:text-white">
                  {t('company.address.value', '〒104-0051 東京都中央区佃2-1-2')}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <Sparkles className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('company.business.label', '事業内容')}
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {t(
                    'company.business.value',
                    'ソフトウェア開発、技術コンサルティング',
                  )}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
