import type { useLocale } from '~/i18n/hooks/useLocale'

interface HeroSectionProps {
  t: ReturnType<typeof useLocale>['t']
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void
}

export function HeroSection({ t, onNavigate }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="fade-in-section mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-6 py-20"
    >
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 font-mono text-xs text-blue-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-blue-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75 dark:bg-blue-400" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
          </span>
          {t('hero.badge', 'Strategic Implementation')}
        </div>

        <h1 className="text-5xl leading-[1.1] font-black tracking-tight text-slate-900 md:text-7xl dark:text-white">
          {t('hero.title.line1', 'Implement Your Business.')}
          <br />
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            {t('hero.title.line2', 'Deliver Through Code.')}
          </span>
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed font-light text-slate-600 md:text-xl dark:text-slate-400">
          {t(
            'hero.description.line1',
            '戦略を描くだけでなく、動くシステムとして実装する。',
          )}
          <br />
          {t(
            'hero.description.line2',
            'アドテクの事業開発から、タクシーサイネージのハードウェア統合まで。',
          )}
          <br className="hidden md:block" />
          {t(
            'hero.description.line3',
            'TechTalkは技術と事業の両面から0→1を生み出してきました。',
          )}
        </p>

        <div className="flex flex-wrap gap-4 pt-8">
          <a
            href="#contact"
            onClick={(e) => onNavigate(e, 'contact')}
            className="rounded bg-slate-900 px-8 py-4 font-bold text-white transition-transform hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-200"
          >
            {t('hero.cta.contact', 'お問い合わせ')}
          </a>
          <a
            href="#services"
            onClick={(e) => onNavigate(e, 'services')}
            className="rounded border border-slate-300 px-8 py-4 font-medium text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-900"
          >
            {t('hero.cta.services', 'サービス詳細')}
          </a>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="mt-24 grid items-start gap-8 border-t border-slate-200 pt-12 md:grid-cols-2 md:gap-12 dark:border-slate-800">
        <div className="h-full">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            {t('hero.value.title', 'TechTalkの提供価値')}
          </h2>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            {t(
              'hero.value.p1',
              '株式会社TechTalkは、技術と事業の両方を理解した上で実装を行う会社です。多くのコンサルティング会社が戦略立案や技術顧問といった抽象的な価値提案に終始する中で、TechTalkは実際に動くシステムを構築します。',
            )}
          </p>
        </div>
        <div className="h-full">
          <p className="leading-relaxed text-slate-600 md:mt-12 dark:text-slate-400">
            {t(
              'hero.value.p2',
              '代表の溝口浩二は現在もコードを書き続けており、経営判断と技術実装の両方に責任を持ちます。事業開発から立ち上げまでの経験が、複合的な実装力の源泉です。',
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
