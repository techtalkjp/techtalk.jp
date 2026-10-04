import type { Handle } from 'remix/component'

import { SITE_URL } from '../../config.ts'
import { otherLocale, type I18n } from '../../i18n/index.ts'
import { paths } from '../../paths.ts'
import { I18nProvider } from '../../i18n/provider.tsx'
import { Document, type Seo } from '../document.tsx'
import { PageShell } from '../layout.tsx'
import { ApproachSection } from './approach.tsx'
import { CasesSection } from './cases.tsx'
import { CompanySection } from './company.tsx'
import { ContactSection, type ContactFormState } from './contact.tsx'
import { HeroSection } from './hero.tsx'
import { ProductsSection } from './products.tsx'
import { ProfileSection } from './profile.tsx'

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
    title: ja
      ? '技術の話から、新しい事業をつくる。 | 株式会社TechTalk'
      : 'From a conversation about technology to a new business | TechTalk, Inc.',
    description: ja
      ? '経営と開発の両方を経験した代表が経営者と直接話し合い、新しい事業の構想から、動く最初の版まで一緒につくります。株式会社TechTalk。'
      : 'A founder with experience in both management and engineering works directly with business owners, from the first idea to a working first version. TechTalk, Inc.',
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
        ? '株式会社TechTalkは、経営者と直接話し合いながら新しい事業の構想から最初の版の開発までを手がける会社です。自社サービスArtifact Shareを開発・運営しています。'
        : 'TechTalk, Inc. works directly with business owners to take new businesses from the first idea to a working first version, and develops and operates Artifact Share.',
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
              <CasesSection />
              <ApproachSection />
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
