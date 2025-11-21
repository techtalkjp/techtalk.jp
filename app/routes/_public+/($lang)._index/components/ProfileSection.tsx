import { BookOpen, Facebook, Github, User } from 'lucide-react'
import { Link } from 'react-router'
import type { useLocale } from '~/i18n/hooks/useLocale'

interface ProfileSectionProps {
  t: ReturnType<typeof useLocale>['t']
  locale: string
}

export function ProfileSection({ t, locale }: ProfileSectionProps) {
  return (
    <section
      id="profile"
      className="fade-in-section mx-auto max-w-6xl px-6 py-24"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-8 backdrop-blur-sm md:p-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex flex-col items-start gap-12 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:w-1/3">
            <div>
              <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">
                {t('profile.position', '代表取締役')}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('profile.name', '溝口 浩二')}
              </h3>
              <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-500">
                {t('profile.nameEn', 'Coji Mizoguchi')}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://zenn.dev/coji"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <BookOpen className="h-4 w-4" /> Zenn
              </a>
              <a
                href="https://github.com/coji"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a
                href="https://www.facebook.com/mizoguchi.coji"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </div>
            <Link
              to={locale === 'en' ? '/en/biography' : '/biography'}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-6 py-3 text-sm font-medium text-slate-900 transition-all hover:border-slate-400 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              <User className="h-4 w-4" />
              {t('profile.biography.link', '詳しい略歴を見る')}
            </Link>
          </div>

          <div className="w-full space-y-6 leading-relaxed text-slate-700 md:w-2/3 dark:text-slate-300">
            <p>
              {t(
                'profile.p1',
                '1999年、ドワンゴでエンジニアとしてキャリアをスタート。ニコニコ動画の成長期を技術面から支えた後、フリークアウトでは事業開発とデータ分析の両面を経験。',
              )}
            </p>
            <p>
              {t(
                'profile.p2',
                '2016年、タクシーサイネージ事業IRISを2名で立ち上げ、代表取締役副社長として経営と実装を統括。2019年にTechTalkを設立し、現在も自らコードを書き続けています。',
              )}
            </p>
            <p>
              {t(
                'profile.p3',
                '経営判断と技術実装の両方に責任を持ち、事業の立ち上げ期や重要な技術判断が必要な局面で、判断の速度と実装の質を提供します。',
              )}
            </p>
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-950/50">
              <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                {t('profile.solo.title', 'ひとり法人の強み')}
              </h4>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t(
                  'profile.solo.description',
                  '大規模な開発体制ではなく、代表が全案件に直接関わることで、ビジネス理解と技術実装を一体化。戦略立案から実装まで、意思決定の速度を保ちながら価値を届けます。',
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
