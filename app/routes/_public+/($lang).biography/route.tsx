import {
  ArrowLeft,
  ExternalLink,
  Facebook,
  Github,
  Twitter,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { MetaFunction } from 'react-router'
import { Link } from 'react-router'
import { ThemeToggle } from '~/components/theme-toggle'
import { useLocale } from '~/i18n/hooks/useLocale'

export const meta: MetaFunction<typeof loader> = ({ params }) => {
  const lang = params.lang ?? 'ja'
  const isJapanese = lang === 'ja'
  const baseUrl = 'https://techtalk.jp'
  const url = isJapanese
    ? `${baseUrl}/biography`
    : `${baseUrl}/${lang}/biography`
  const title = isJapanese
    ? '溝口 浩二 - Biography | TechTalk, Inc.'
    : 'Coji Mizoguchi - Biography | TechTalk, Inc.'
  const description = isJapanese
    ? '技術と事業の両面から0→1を生み出すことを専門としています。フリークアウト、IRIS、TechTalkでの経験。'
    : 'Specializing in creating 0-to-1 value from both technical and business perspectives. Experience at FreakOut, IRIS, and TechTalk.'

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'profile' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpeg` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `${baseUrl}/og-image.jpeg` },
    { tagName: 'link', rel: 'canonical', href: url },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'ja',
      href: `${baseUrl}/biography`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: `${baseUrl}/en/biography`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${baseUrl}/biography`,
    },
  ]
}

export const loader = ({ params }: { params: { lang?: string } }) => {
  const lang = params.lang

  // Validate lang parameter - only 'en' is supported, everything else defaults to 'ja'
  if (lang && lang !== 'en' && lang !== 'ja') {
    throw new Response('Not Found', { status: 404 })
  }

  // Normalize lang to ensure consistency
  const normalizedLang = lang === 'en' ? 'en' : 'ja'

  return { lang: normalizedLang }
}

export default function BiographyPage() {
  const { t, locale } = useLocale()
  const [mounted, setMounted] = useState(false)

  // Synchronize with DOM: trigger animations after component mounts
  useEffect(() => {
    setMounted(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-5')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      },
    )

    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach((el) => {
      observer.observe(el)
    })

    return () => {
      animatedElements.forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])

  const articles = [
    {
      href: 'https://forbesjapan.com/articles/detail/22941',
      image:
        'https://shareboss.net/wp-content/uploads/2019/11/c0ef11a7611e6c1a64940ca869d9adf5.jpg',
      publisher: t('bio.media.forbes.title', 'Forbes JAPAN'),
      title: t(
        'bio.media.forbes.description',
        '合弁会社で世界へ タクシーメディアの掲げる野望',
      ),
    },
    {
      href: 'https://thebridge.jp/2014/06/takanori-oshiba-interview-series-vol-7',
      image: 'https://thebridge.jp/wp-content/uploads/2014/06/freakout1.jpg',
      publisher: t('bio.media.thebridge.title', 'THE BRIDGE'),
      title: t(
        'bio.media.thebridge.description',
        '「本田の描く広告の未来を実現する」ーー隠れたキーマンを調べるお・フリークアウト、溝口氏インタビュー',
      ),
    },
    {
      href: 'https://japan.cnet.com/article/20361283/',
      image:
        'https://japan.cnet.com/story_media/20361283/CNETJ/071117_niwango2.jpg',
      publisher: t('bio.media.cnet.title', 'CNET Japan'),
      title: t(
        'bio.media.cnet.description',
        'ニワンゴ技術責任者が語る、「ニコニコ動画」成功の鍵',
      ),
    },
  ]

  const careers = [
    {
      period: t('bio.career.techtalk.period', '2019年 - 現在'),
      title: t('bio.career.techtalk.title', '株式会社TechTalk 代表取締役'),
      description: t(
        'bio.career.techtalk.description',
        'ひとり法人として複数の企業に対して技術実装を提供。化学物質検索システム、AI活用MVP、データパイプライン、マーケティング統合など、幅広い領域で実装を継続。',
      ),
    },
    {
      period: t('bio.career.iris.period', '2016年 - 2019年'),
      title: t('bio.career.iris.title', '株式会社IRIS 代表取締役副社長'),
      description: t(
        'bio.career.iris.description',
        'タクシーサイネージ事業を2名体制で立ち上げ。事業計画の立案から経営レベルのマネジメント、ハードウェア・動画広告・配信システムの統合まで、事業と技術のすべてを統括。',
      ),
    },
    {
      period: t('bio.career.freakout.period', '2013年 - 2016年'),
      title: t(
        'bio.career.freakout.title',
        '株式会社FreakOut(現 株式会社フリークアウト・ホールディングス)',
      ),
      description: t(
        'bio.career.freakout.description',
        '技術に基づいた事業開発やアライアンスに従事。DSPの入札ロジック構築においてはデータアナリストとして機械学習モデルの開発・分析を担当し、ビジネスと技術の接続を主導。',
      ),
    },
    {
      period: t('bio.career.dwango.period', '1999年 - 2013年'),
      title: t(
        'bio.career.dwango.title',
        '株式会社ドワンゴ / 株式会社ニワンゴ',
      ),
      description: t(
        'bio.career.dwango.description',
        'エンジニア、プログラマーとしてキャリアをスタート。着メロサービス、動画サービス、ポータルサイトなどのエンジニアリングマネージャーを経験。ニワンゴでは技術担当取締役を担当。',
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-white">
      {/* Background Grid */}
      <div className="bg-grid fixed inset-0 opacity-30 dark:opacity-100" />

      {/* Content */}
      <div className="relative">
        {/* Navigation */}
        <nav className="border-b border-slate-200 dark:border-white/10">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link
              to={locale === 'en' ? '/en' : '/'}
              className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('bio.back', 'トップへ戻る')}
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div
                className={`text-center transition-all duration-1000 ${
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-5 opacity-0'
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

        {/* Social Links */}
        <section className="border-t border-slate-200 py-12 dark:border-white/10">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="animate-on-scroll translate-y-5 opacity-0 transition-all duration-700">
                <h2 className="mb-6 text-sm font-semibold tracking-wider text-slate-500 dark:text-white/50">
                  {t('bio.social.title', 'CONNECT')}
                </h2>
                <div className="flex gap-4">
                  <a
                    href="https://x.com/techtalkjp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <Twitter className="h-5 w-5" />
                    <span>X</span>
                  </a>
                  <a
                    href="https://www.facebook.com/mizoguchi.coji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://github.com/coji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Timeline */}
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

        {/* Media Coverage */}
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

        {/* Footer */}
        <footer className="border-t border-slate-200 py-12 dark:border-white/10">
          <div className="container mx-auto px-6">
            <div className="text-center text-sm text-slate-500 dark:text-white/50">
              {t('footer.copyright', '© TechTalk Inc. All Rights Reserved.')}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
