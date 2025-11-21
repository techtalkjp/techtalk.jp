import { Compass, DatabaseZap, Layers, Sparkles } from 'lucide-react'
import type { useLocale } from '~/i18n/hooks/useLocale'

interface ServicesSectionProps {
  t: ReturnType<typeof useLocale>['t']
}

export function ServicesSection({ t }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="relative border-t border-slate-200 bg-white py-24 dark:border-slate-900/50 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="fade-in-section mb-16">
          <h2 className="mb-2 font-mono text-sm text-blue-600 dark:text-blue-400">
            {t('services.section.label', 'OUR SERVICES')}
          </h2>
          <h3 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
            {t('services.section.title', '4つのサービス領域')}
          </h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Service 1 */}
          <div className="group fade-in-section flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/30 dark:hover:border-blue-500/30 dark:hover:bg-slate-900/80">
            <div className="mb-6">
              <div className="icon-glow flex h-14 w-14 items-center justify-center rounded-xl border border-blue-500/20 bg-linear-to-br from-blue-500/20 to-transparent text-blue-600 dark:text-blue-400">
                <Layers className="h-7 w-7" strokeWidth={1.5} />
              </div>
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {t('services.mvp.title', 'MVP Development & Architecture')}
            </h4>
            <p className="mb-6 grow text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t(
                'services.mvp.description',
                'タクシーサイネージ事業を2名体制で立ち上げた経験から、限られたリソースで事業を形にする実装力を提供します。技術選定からアーキテクチャ設計まで、事業の成長を見据えた判断で市場投入を支援します。',
              )}
            </p>
            <ul className="space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700 dark:border-slate-800/50 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-blue-500" />
                {t('services.mvp.item1', '成長を見据えた技術選定')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-blue-500" />
                {t('services.mvp.item2', '最小限のコストで市場検証')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-blue-500" />
                {t('services.mvp.item3', '事業フェーズに応じた設計判断')}
              </li>
            </ul>
          </div>

          {/* Service 2 */}
          <div className="group fade-in-section flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/30 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900/80">
            <div className="mb-6">
              <div className="icon-glow flex h-14 w-14 items-center justify-center rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/20 to-transparent text-indigo-600 dark:text-indigo-400">
                <DatabaseZap className="h-7 w-7" strokeWidth={1.5} />
              </div>
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {t('services.data.title', 'Data Infrastructure & Analytics')}
            </h4>
            <p className="mb-6 grow text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t(
                'services.data.description',
                'DSPの入札ロジック構築でデータアナリストとして機械学習モデルを開発した経験から、ビジネス課題を解決するデータ基盤を構築します。DuckDB、dbt、BigQueryを用いて、意思決定を支えるデータ活用を実装します。',
              )}
            </p>
            <ul className="space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700 dark:border-slate-800/50 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-indigo-500" />
                {t('services.data.item1', 'ビジネス課題に直結するデータ設計')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-indigo-500" />
                {t('services.data.item2', '分析から可視化まで一貫構築')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-indigo-500" />
                {t('services.data.item3', '機械学習モデルの実装支援')}
              </li>
            </ul>
          </div>

          {/* Service 3 */}
          <div className="group fade-in-section flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-purple-300 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/30 dark:hover:border-purple-500/30 dark:hover:bg-slate-900/80">
            <div className="mb-6">
              <div className="icon-glow flex h-14 w-14 items-center justify-center rounded-xl border border-purple-500/20 bg-linear-to-br from-purple-500/20 to-transparent text-purple-600 dark:text-purple-400">
                <Sparkles className="h-7 w-7" strokeWidth={1.5} />
              </div>
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
              {t('services.ai.title', 'AI Integration & Strategy')}
            </h4>
            <p className="mb-6 grow text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t(
                'services.ai.description',
                '技術トレンドと事業価値の両面から、生成AIの実装判断を行います。Vercel AI SDKなどの最新技術を使い、実際に動く形でAIの価値を実証。戦略立案から実装まで一貫して提供します。',
              )}
            </p>
            <ul className="space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700 dark:border-slate-800/50 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-purple-500" />
                {t('services.ai.item1', 'ROIを意識したAI活用戦略')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-purple-500" />
                {t('services.ai.item2', 'プロダクトへのAI統合実装')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-purple-500" />
                {t('services.ai.item3', 'プロンプトエンジニアリング')}
              </li>
            </ul>
          </div>

          {/* Service 4 */}
          <div className="group fade-in-section flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-emerald-300 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/30 dark:hover:border-emerald-500/30 dark:hover:bg-slate-900/80">
            <div className="mb-6">
              <div className="icon-glow flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/20 to-transparent text-emerald-600 dark:text-emerald-400">
                <Compass className="h-7 w-7" strokeWidth={1.5} />
              </div>
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
              {t('services.leadership.title', 'Project Leadership & Advisory')}
            </h4>
            <p className="mb-6 grow text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t(
                'services.leadership.description',
                'フリークアウトでの事業開発、IRISでの経営経験から、技術とビジネスの両面を理解した判断を提供します。開発マネジメント、技術選定、マーケティング統合など、プロジェクトの重要な局面を支援します。',
              )}
            </p>
            <ul className="space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700 dark:border-slate-800/50 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                {t('services.leadership.item1', '経営視点での技術判断')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                {t('services.leadership.item2', '少数精鋭チームのマネジメント')}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                {t('services.leadership.item3', '事業KPIを意識した開発推進')}
              </li>
            </ul>
          </div>
        </div>

        {/* Tech Stack Bar */}
        <div className="fade-in-section mt-20 border-t border-slate-200 pt-12 dark:border-slate-900/50">
          <p className="mb-8 text-center font-mono text-xs tracking-widest text-slate-400 dark:text-slate-500">
            {t('services.tech.label', 'CORE TECHNOLOGIES')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-600 md:text-base dark:text-slate-400">
            <span className="transition-colors hover:text-slate-900 dark:hover:text-white">
              React Router
            </span>
            <span className="transition-colors hover:text-slate-900 dark:hover:text-white">
              TypeScript
            </span>
            <span className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Cloudflare
            </span>
            <span className="transition-colors hover:text-slate-900 dark:hover:text-white">
              PostgreSQL
            </span>
            <span className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Prisma
            </span>
            <span className="transition-colors hover:text-slate-900 dark:hover:text-white">
              DuckDB
            </span>
            <span className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Vercel AI SDK
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
