import type { Handle } from 'remix/component'

import { SITE_URL } from '../../config.ts'
import { otherLocale, type I18n } from '../../i18n/index.ts'
import { paths } from '../../paths.ts'
import { I18nProvider } from '../../i18n/provider.tsx'
import { Document, type Seo } from '../document.tsx'
import { PageShell } from '../layout.tsx'
import { CompanySection } from './company.tsx'
import { ContactSection, type ContactFormState } from './contact.tsx'
import { HeroSection } from './hero.tsx'
import { ProductsSection } from './products.tsx'
import { ProfileSection } from './profile.tsx'
import { ServicesSection } from './services.tsx'

export interface HomePageProps {
  i18n: I18n
  /** JS なしで送信してエラーになったときのフォーム状態 */
  contactState?: ContactFormState
  /** JS なしで送信に成功してリダイレクトされてきた */
  sent?: boolean
}

const SOCIAL = [
  'https://github.com/coji',
  'https://x.com/techtalkjp',
  'https://zenn.dev/coji',
  'https://www.facebook.com/mizoguchi.coji',
]

function homeSeo({ locale }: I18n): Seo {
  let ja = locale === 'ja'
  return {
    title: 'TechTalk, Inc. | Implement Your Business. Deliver Through Code.',
    description: ja
      ? '株式会社TechTalkは、AI成果物の共有サービス「Artifact Share」の開発・運営と、事業開発から実装まで一貫した技術支援を行っています。'
      : 'TechTalk, Inc. develops and operates Artifact Share, a service for sharing AI-generated work, and provides end-to-end technical support from business development through implementation.',
    path: paths.home(locale),
    siteName: ja ? '株式会社TechTalk' : 'TechTalk, Inc.',
    keywords:
      'Artifact Share,AIエージェント,MVP開発,AI統合,React Router,TypeScript,Cloudflare Workers,D1,R2',
    alternates: { ja: paths.home('ja'), en: paths.home('en') },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TechTalk, Inc.',
      alternateName: '株式会社TechTalk',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      description: ja
        ? '株式会社TechTalkは、Artifact Shareの開発・運営と、事業開発から実装まで一貫した技術支援を行っています。'
        : 'TechTalk, Inc. develops and operates Artifact Share and provides end-to-end technical support from business development through implementation.',
      address: {
        '@type': 'PostalAddress',
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
        jobTitle: ja ? '代表取締役' : 'CEO',
        url: 'https://github.com/coji',
        sameAs: SOCIAL,
      },
      sameAs: SOCIAL,
    },
  }
}

export function HomePage(handle: Handle<HomePageProps>) {
  return () => {
    let { i18n, contactState, sent } = handle.props
    return (
      <Document locale={i18n.locale} seo={homeSeo(i18n)}>
        <I18nProvider value={i18n}>
          <PageShell home languageHref={paths.home(otherLocale(i18n.locale))}>
            <main id="top">
              <HeroSection />
              <ServicesSection />
              <ProductsSection />
              <ProfileSection />
              <CompanySection />
              <ContactSection fallbackState={contactState} sent={sent} />
            </main>
          </PageShell>
        </I18nProvider>
      </Document>
    )
  }
}
