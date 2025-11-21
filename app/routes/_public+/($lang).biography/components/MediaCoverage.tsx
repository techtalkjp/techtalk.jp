import { ExternalLink } from 'lucide-react'
import { useLocale } from '~/i18n/hooks/useLocale'

interface Article {
  href: string
  image: string
  publisher: string
  title: string
}

interface MediaCoverageProps {
  articles: Article[]
}

export function MediaCoverage({ articles }: MediaCoverageProps) {
  const { t } = useLocale()
  return (
    <section className="border-t border-slate-200 py-24 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="animate-on-scroll translate-y-5 opacity-0 transition-all duration-700">
            <h2 className="mb-12 text-sm font-semibold tracking-wider text-slate-500 dark:text-white/50">
              {t('bio.media.title', 'MEDIA COVERAGE')}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article, index) => (
              <a
                key={article.href}
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-on-scroll group translate-y-5 opacity-0 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/[0.07]">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 text-xs text-slate-500 dark:text-white/50">
                      {article.publisher}
                    </div>
                    <h3 className="mb-3 line-clamp-2 text-sm font-medium text-slate-900 dark:text-white/90">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-white/50 dark:group-hover:text-white/70">
                      <span>Read more</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
