import type { LinksFunction, MetaFunction } from 'react-router'
import { Footer } from '~/components/layout/Footer'
import { SITE_URL } from '~/config/site'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'
import { useLocale } from '~/i18n/hooks/useLocale'
import { locales } from '~/i18n/utils/detectLocale'
import type { Route } from './+types/route'
import { CompanySection } from './components/CompanySection'
import { ContactSection } from './components/ContactSection'
import { HeroSection } from './components/HeroSection'
import { Navigation } from './components/Navigation'
import { ProfileSection } from './components/ProfileSection'
import { ServicesSection } from './components/ServicesSection'
import { useCopyToClipboard } from './hooks/useCopyToClipboard'

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

  const url = isJapanese ? SITE_URL : `${SITE_URL}/${lang}`

  const title =
    'TechTalk, Inc. | Implement Your Business. Deliver Through Code.'

  const description = isJapanese
    ? '株式会社TechTalkは、事業開発から実装までを一貫して行う技術パートナーです。MVP開発、データ基盤構築、AI統合、プロジェクトリーダーシップを提供します。Remix, DuckDB, Vercel AI SDK等の最新技術を活用し、ビジネスを実装します。'
    : 'TechTalk, Inc. is a technical partner that handles everything from business development to implementation. We provide MVP development, data infrastructure, AI integration, and project leadership using cutting-edge technologies like Remix, DuckDB, and Vercel AI SDK.'

  const siteName = isJapanese ? '株式会社TechTalk' : 'TechTalk, Inc.'
  const ogImage = `${SITE_URL}/og-image.jpeg` // OG画像のパス

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
    { tagName: 'link', rel: 'alternate', hrefLang: 'ja', href: SITE_URL },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: `${SITE_URL}/en`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: SITE_URL,
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
  const { locale } = useLocale()
  const isJapanese = locale === 'ja'

  // アニメーション用のObserver設定
  useScrollAnimation()

  // メールコピー機能
  const { copy: copyEmail, showFeedback: showCopyFeedback } =
    useCopyToClipboard()

  const handleCopyEmail = () => {
    copyEmail('contact@techtalk.jp')
  }

  // スムーススクロール用ハンドラ(React Router環境でのハッシュリンク用)
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault()

    // "top" の場合は完全に一番上にスクロール
    if (id === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      return
    }

    const element = document.getElementById(id)
    if (element) {
      // ナビゲーションの高さ(80px)を考慮してスクロール
      const navHeight = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - navHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechTalk, Inc.',
    alternateName: '株式会社TechTalk',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: isJapanese
      ? '株式会社TechTalkは、事業開発から実装までを一貫して行う技術パートナーです。MVP開発、データ基盤構築、AI統合、プロジェクトリーダーシップを提供します。'
      : 'TechTalk, Inc. is a technical partner that handles everything from business development to implementation.',
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white dark:bg-[#020617] dark:text-slate-200">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Effects */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 h-screen opacity-30 dark:opacity-100" />
      <div className="pointer-events-none fixed top-0 right-0 z-0 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-900/20" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-[120px] dark:bg-indigo-900/10" />

      {/* Navigation */}
      <Navigation onNavigate={scrollToSection} />

      <main className="relative z-10 pt-20">
        {/* 1. TOP / Hero Section */}
        <HeroSection onNavigate={scrollToSection} />

        {/* 2. Services */}
        <ServicesSection />

        {/* 3. Profile */}
        <ProfileSection />

        {/* 4. Company Information */}
        <CompanySection />

        {/* 5. Contact */}
        <ContactSection
          showCopyFeedback={showCopyFeedback}
          onCopyEmail={handleCopyEmail}
        />
      </main>

      <Footer />
    </div>
  )
}
