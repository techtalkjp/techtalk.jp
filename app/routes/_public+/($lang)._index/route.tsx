import {
  BookOpen,
  Building2,
  Check,
  Compass,
  Copy,
  DatabaseZap,
  Facebook,
  Github,
  Layers,
  Menu,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { LinksFunction, MetaFunction } from 'react-router'
import { Link } from 'react-router'
import { ThemeToggle } from '~/components/theme-toggle'
import LanguageSwitcher from '~/i18n/components/LanguageSwitcher'
import { useLocale } from '~/i18n/hooks/useLocale'
import { locales } from '~/i18n/utils/detectLocale'
import type { Route } from './+types/route'

export const loader = ({ params }: Route.LoaderArgs) => {
  // If lang is undefined, treat it as 'ja' (default)
  // Only validate if lang is provided
  if (params.lang && !locales.includes(params.lang)) {
    throw new Response('404 Not Found', { status: 404 })
  }
  return {}
}

// ページメタデータの設定
export const meta: MetaFunction<typeof loader> = ({ params }) => {
  const lang = params.lang ?? 'ja'
  const isJapanese = lang === 'ja'

  const baseUrl = 'https://techtalk.jp'
  const url = isJapanese ? baseUrl : `${baseUrl}/${lang}`

  const title =
    'TechTalk, Inc. | Implement Your Business. Deliver Through Code.'

  const description = isJapanese
    ? '株式会社TechTalkは、事業開発から実装までを一貫して行う技術パートナーです。MVP開発、データ基盤構築、AI統合、プロジェクトリーダーシップを提供します。Remix, DuckDB, Vercel AI SDK等の最新技術を活用し、ビジネスを実装します。'
    : 'TechTalk, Inc. is a technical partner that handles everything from business development to implementation. We provide MVP development, data infrastructure, AI integration, and project leadership using cutting-edge technologies like Remix, DuckDB, and Vercel AI SDK.'

  const siteName = isJapanese ? '株式会社TechTalk' : 'TechTalk, Inc.'
  const ogImage = `${baseUrl}/og-image.jpeg` // OG画像のパス

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechTalk, Inc.',
    alternateName: '株式会社TechTalk',
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    description: description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '佃2-1-2',
      addressLocality: '中央区',
      addressRegion: '東京都',
      addressCountry: 'JP',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@techtalk.jp',
      contactType: 'Customer Service',
    },
    founder: {
      '@type': 'Person',
      name: 'Coji Mizoguchi',
      alternateName: '溝口浩二',
      jobTitle: isJapanese ? '代表取締役' : 'CEO',
      url: 'https://github.com/coji',
      sameAs: [
        'https://github.com/coji',
        'https://x.com/techtalkjp',
        'https://zenn.dev/coji',
        'https://www.facebook.com/mizoguchi.coji',
      ],
    },
    sameAs: [
      'https://github.com/coji',
      'https://x.com/techtalkjp',
      'https://zenn.dev/coji',
      'https://www.facebook.com/mizoguchi.coji',
    ],
  }

  return [
    { title },
    { name: 'description', content: description },

    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: siteName },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: isJapanese ? 'ja_JP' : 'en_US' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },

    // Additional SEO
    {
      name: 'keywords',
      content: 'MVP開発,データ基盤,AI統合,React,TypeScript,Cloudflare,DuckDB',
    },
    { name: 'author', content: 'TechTalk, Inc.' },
    { name: 'robots', content: 'index, follow' },

    // Canonical URL
    { tagName: 'link', rel: 'canonical', href: url },

    // Alternate language links
    { tagName: 'link', rel: 'alternate', hrefLang: 'ja', href: baseUrl },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: `${baseUrl}/en`,
    },
    { tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: baseUrl },

    // JSON-LD
    {
      tagName: 'script',
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd),
    },
  ]
}

// Google Fontsの読み込み
export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Inter:wght@300;400;600&display=swap',
  },
]

export default function TechTalkPage() {
  const { t, locale } = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)

  // アニメーション用のObserver設定
  // External synchronization: IntersectionObserver API for scroll-based animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-5')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.fade-in-section').forEach((section) => {
      // 初期状態のクラスを適用(JSが有効な場合のみ)
      section.classList.add(
        'opacity-0',
        'translate-y-5',
        'transition-all',
        'duration-1000',
        'ease-out',
      )
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // メールコピー機能
  // External synchronization: Clipboard API for copying email
  const copyEmail = () => {
    const email = 'contact@techtalk.jp'
    navigator.clipboard.writeText(email).then(() => {
      setShowCopyFeedback(true)
      setTimeout(() => {
        setShowCopyFeedback(false)
      }, 2000)
    })
  }

  // スムーススクロール用ハンドラ(React Router環境でのハッシュリンク用)
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault()
    setIsMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white dark:bg-[#020617] dark:text-slate-200">
      {/* Background Effects */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 h-screen opacity-30 dark:opacity-100" />
      <div className="pointer-events-none fixed top-0 right-0 z-0 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-900/20" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-[120px] dark:bg-indigo-900/10" />

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-[#020617]/80">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <a
            href="#top"
            onClick={(e) => scrollToSection(e, 'top')}
            className="flex items-center gap-2 text-xl font-bold tracking-tighter text-slate-900 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-900 text-sm font-black text-white dark:bg-white dark:text-black">
              TT
            </span>
            TechTalk
          </a>

          {/* Desktop Menu */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-400">
            <a
              href="#top"
              onClick={(e) => scrollToSection(e, 'top')}
              className="transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              {t('nav.top', 'Top')}
            </a>
            <a
              href="#services"
              onClick={(e) => scrollToSection(e, 'services')}
              className="transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              {t('nav.services', 'Services')}
            </a>
            <a
              href="#profile"
              onClick={(e) => scrollToSection(e, 'profile')}
              className="transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              {t('nav.profile', 'Profile')}
            </a>
            <a
              href="#company"
              onClick={(e) => scrollToSection(e, 'company')}
              className="transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              {t('nav.company', 'Company')}
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="rounded-full border border-slate-300 bg-slate-900 px-5 py-2 font-semibold text-white transition-colors hover:bg-slate-800 dark:border-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-100"
            >
              {t('nav.contact', 'Contact')}
            </a>
            <ThemeToggle />
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="p-2 text-slate-900 md:hidden dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="animate-in slide-in-from-top-5 absolute top-20 left-0 flex w-full flex-col gap-6 border-b border-slate-200 bg-white p-6 text-center shadow-2xl duration-200 md:hidden dark:border-slate-800 dark:bg-[#020617]">
            <a
              href="#top"
              onClick={(e) => scrollToSection(e, 'top')}
              className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {t('nav.top', 'Top')}
            </a>
            <a
              href="#services"
              onClick={(e) => scrollToSection(e, 'services')}
              className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {t('nav.services', 'Services')}
            </a>
            <a
              href="#profile"
              onClick={(e) => scrollToSection(e, 'profile')}
              className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {t('nav.profile', 'Profile')}
            </a>
            <a
              href="#company"
              onClick={(e) => scrollToSection(e, 'company')}
              className="text-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {t('nav.company', 'Company')}
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {t('nav.contact', 'Contact')}
            </a>
            <div className="flex items-center justify-center gap-4 pt-4">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 pt-20">
        {/* 1. TOP / Hero Section */}
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
                onClick={(e) => scrollToSection(e, 'contact')}
                className="rounded bg-slate-900 px-8 py-4 font-bold text-white transition-transform hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              >
                {t('hero.cta.contact', 'お問い合わせ')}
              </a>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, 'services')}
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

        {/* 2. Services */}
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
                    {t(
                      'services.data.item1',
                      'ビジネス課題に直結するデータ設計',
                    )}
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
                  {t(
                    'services.leadership.title',
                    'Project Leadership & Advisory',
                  )}
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
                    {t(
                      'services.leadership.item2',
                      '少数精鋭チームのマネジメント',
                    )}
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    {t(
                      'services.leadership.item3',
                      '事業KPIを意識した開発推進',
                    )}
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

        {/* 3. Profile */}
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

        {/* 4. Company Information */}
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
              <div className="space-y-6">
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
                      {t(
                        'company.address.value',
                        '〒104-0051 東京都中央区佃2-1-2',
                      )}
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
              </div>
            </div>
          </div>
        </section>

        {/* 5. Contact */}
        <section
          id="contact"
          className="border-t border-slate-200 py-24 dark:border-slate-900"
        >
          <div className="fade-in-section mx-auto max-w-4xl px-6 text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">
              {t('contact.heading', 'お問い合わせ')}
            </h2>
            <p className="mb-12 leading-relaxed text-slate-600 dark:text-slate-400">
              {t(
                'contact.description.line1',
                '技術実装、プロジェクト推進、技術顧問など、どのような形でのご相談も受け付けています。',
              )}
              <br />
              {t(
                'contact.description.line2',
                '抱えている課題と期待する成果をお聞かせください。',
              )}
            </p>

            <div className="inline-block w-full max-w-2xl rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-8 shadow-2xl md:p-12 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
              <p className="mb-4 font-mono text-sm text-slate-500 dark:text-slate-500">
                {t('contact.email.label', 'EMAIL')}
              </p>
              <a
                href="mailto:contact@techtalk.jp"
                className="font-mono text-2xl font-bold tracking-tight break-all text-slate-900 transition-colors hover:text-blue-600 md:text-4xl dark:text-white dark:hover:text-blue-400"
              >
                contact@techtalk.jp
              </a>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded border border-slate-300 px-5 py-2.5 text-sm text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {showCopyFeedback ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">
                        {t('contact.copy.success', 'Copied!')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      {t('contact.copy.button', 'メールアドレスをコピー')}
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-10 h-px w-full bg-slate-200 dark:bg-slate-800/50" />

              {/* Messenger Section */}
              <p className="mb-4 font-mono text-sm text-slate-500 dark:text-slate-500">
                {t('contact.messenger.label', 'MESSENGER')}
              </p>
              <a
                href="https://m.me/mizoguchi.coji"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-xl font-bold text-slate-900 transition-colors hover:text-blue-600 md:text-2xl dark:text-white dark:hover:text-blue-400"
              >
                <Facebook className="h-6 w-6 text-blue-500 transition-colors group-hover:text-blue-600 md:h-8 md:w-8 dark:group-hover:text-blue-400" />
                <span>mizoguchi.coji</span>
              </a>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
                {t(
                  'contact.messenger.description',
                  'Facebook Messengerでもお気軽にご連絡ください',
                )}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-900 dark:bg-[#020617]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-slate-900 text-xs font-black text-white dark:bg-slate-800 dark:text-white">
              TT
            </span>
            {t('footer.company', 'TechTalk Inc.')}
          </div>
          <div className="font-mono text-sm text-slate-500 dark:text-slate-600">
            {t('footer.copyright', '© TechTalk Inc. All Rights Reserved.')}
          </div>
        </div>
      </footer>
    </div>
  )
}
