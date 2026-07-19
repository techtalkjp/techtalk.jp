import { ArrowUpRight, Bot, Link2, RefreshCw, ShieldCheck } from 'lucide-react'
import { useLocale } from '~/i18n/hooks/useLocale'

const features = [
  {
    icon: Link2,
    title: 'すぐに共有できる',
    description:
      'HTML、Markdown、静的サイトを、閲覧用の安定したURLで共有できます。',
  },
  {
    icon: RefreshCw,
    title: '同じURLで更新できる',
    description:
      '成果物を更新しても共有先はそのまま。レビューと改善を継続できます。',
  },
  {
    icon: Bot,
    title: 'AIエージェントから使える',
    description:
      'Web、CLI、MCPを通じて、人とAIエージェントのどちらからでも操作できます。',
  },
  {
    icon: ShieldCheck,
    title: '共有範囲を管理できる',
    description: '公開、ワークスペース、個別共有を用途に応じて選択できます。',
  },
]

export function ProductsSection() {
  const { t } = useLocale()

  return (
    <section
      id="products"
      className="relative border-t border-slate-200 bg-slate-950 py-24 text-white dark:border-slate-800"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="fade-in-section grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="mb-5 font-mono text-sm text-blue-400">
              {t('products.section.label', 'OUR PRODUCT')}
            </p>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-xl font-black tracking-tighter text-slate-950">
                AS
              </div>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Artifact Share
              </h2>
            </div>
            <h3 className="max-w-2xl text-2xl leading-snug font-bold text-slate-100 md:text-3xl">
              {t(
                'products.artifactshare.tagline',
                'AIがつくった成果物を、チームや顧客へ届ける。',
              )}
            </h3>
            <p className="mt-6 max-w-2xl leading-relaxed text-slate-400">
              {t(
                'products.artifactshare.description',
                'Artifact Shareは、AIエージェントや開発ツールで作ったレポート、ドキュメント、Webサイトを、共有・レビュー・継続更新するためのサービスです。株式会社TechTalkが企画・開発・運営しています。',
              )}
            </p>
            <a
              href="https://artifactshare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded bg-white px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-blue-100"
            >
              {t('products.artifactshare.cta', 'Artifact Shareを見る')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-slate-900 p-6">
                <Icon
                  className="mb-4 h-5 w-5 text-blue-400"
                  strokeWidth={1.75}
                />
                <h4 className="mb-2 font-bold text-slate-100">
                  {t(title, title)}
                </h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  {t(description, description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
