import { css, type Handle } from 'remix/component'

import { otherLocale, type I18n } from '../../i18n/index.ts'
import { paths } from '../../paths.ts'
import { getI18n, I18nProvider } from '../../i18n/provider.tsx'
import { Document, type Seo } from '../document.tsx'
import { ArrowUpRightIcon } from '../icons.tsx'
import { PageShell } from '../layout.tsx'
import { PageIntro } from '../page-intro.tsx'
import { PressList } from '../press-list.tsx'
import { Section } from '../section.tsx'
import { externalLink, textLink } from '../styles.ts'

function biographySeo({ locale }: I18n): Seo {
  let ja = locale === 'ja'
  return {
    title: ja
      ? '溝口 浩二 - Biography | TechTalk, Inc.'
      : 'Coji Mizoguchi - Biography | TechTalk, Inc.',
    description: ja
      ? '技術と事業の両面から0→1を生み出すことを専門としています。フリークアウト、IRIS、TechTalkでの経験。'
      : 'Specializing in creating 0→1 value from both technical and business perspectives. Experience at FreakOut, IRIS, and TechTalk.',
    path: paths.biography(locale),
    ogType: 'profile',
    alternates: { ja: paths.biography('ja'), en: paths.biography('en') },
  }
}

const careers = [
  {
    period: '2019年 - 現在',
    title: '株式会社TechTalk 代表取締役',
    description:
      'ひとり法人として複数の企業に対して技術実装を提供。化学物質検索システム、AI活用MVP、データパイプライン、マーケティング統合など、幅広い領域で実装を継続。',
  },
  {
    period: '2016年 - 2019年',
    title: '株式会社IRIS 代表取締役副社長',
    description:
      'FreakOutでの事業開発・アライアンス業務の中で、JapanTaxiとの合弁会社として設立。タクシーサイネージ事業を2名体制で立ち上げ、事業計画の立案から経営レベルのマネジメント、ハードウェア・動画広告・配信システムの統合まで、事業と技術のすべてを統括。',
  },
  {
    period: '2013年 - 2019年',
    title: '株式会社FreakOut(現 株式会社フリークアウト・ホールディングス)',
    description:
      '技術に基づいた事業開発やアライアンスに従事。DSPの入札ロジック構築では、データアナリストとしてビジネス要件を数値化し、機械学習チームとの橋渡しを担当。',
  },
  {
    period: '1999年 - 2013年',
    title: '株式会社ドワンゴ / 株式会社ニワンゴ',
    description:
      'エンジニア、プログラマーとしてキャリアをスタート。着メロサービスやポータルサイトなどのエンジニアリングマネージャーを経験。ニワンゴでは技術担当取締役を担当。',
  },
]

const links = [
  { href: 'https://github.com/coji', label: 'GitHub' },
  { href: 'https://zenn.dev/coji', label: 'Zenn' },
  { href: 'https://x.com/techtalkjp', label: 'X' },
  { href: 'https://www.facebook.com/mizoguchi.coji', label: 'Facebook' },
]

export function BiographyPage(handle: Handle<{ i18n: I18n }>) {
  return () => {
    let { i18n } = handle.props
    return (
      <Document locale={i18n.locale} seo={biographySeo(i18n)}>
        <I18nProvider value={i18n}>
          <PageShell languageHref={paths.biography(otherLocale(i18n.locale))}>
            <main>
              <BiographyIntro />
              <CareerSection />
              <Section id="press" name={i18n.t('掲載記事')}>
                <PressList firstRowAligned />
              </Section>
            </main>
          </PageShell>
        </I18nProvider>
      </Document>
    )
  }
}

function BiographyIntro(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <PageIntro
        before={
          <img
            src="/images/coji.webp"
            alt={t('溝口浩二の写真')}
            width={112}
            height={112}
            mix={css({
              width: '112px',
              height: '112px',
              marginBottom: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 0 0 1px var(--border-strong)',
            })}
          />
        }
        title={t('溝口 浩二')}
        lede={
          <>
            {t('株式会社TechTalk 代表取締役。')}
            {t('技術と事業の両面から、新しい事業を立ち上げてきました。')}
          </>
        }
      >
        <div
          mix={css({
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '24px',
            marginTop: '24px',
            fontSize: 'var(--t-14)',
          })}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener"
              mix={[textLink, externalLink]}
            >
              {link.label}
              <ArrowUpRightIcon size={12} />
            </a>
          ))}
        </div>
      </PageIntro>
    )
  }
}

function CareerSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <Section id="career" name={t('経歴')}>
        <ol
          // リストの見た目を消すと Safari の読み上げがリストとして扱わなくなるので、明示する
          role="list"
        >
          {careers.map((career) => (
            <li
              key={career.title}
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '4px',
                padding: '28px 0',
                borderBottom: '1px solid var(--border)',
                // 左のセクション名と 1 行目を同じ線に乗せる
                '&:first-child': { paddingTop: '8px' },
                '@media (min-width: 760px)': {
                  gridTemplateColumns: '160px minmax(0, 1fr)',
                  gap: '24px',
                },
              })}
            >
              <p
                mix={css({
                  fontSize: 'var(--t-14)',
                  lineHeight: '25.6px',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--text-subtle)',
                })}
              >
                {t(career.period)}
              </p>
              <div>
                <h2 mix={css({ fontSize: 'var(--t-16)', lineHeight: 1.6 })}>
                  {t(career.title)}
                </h2>
                <p mix={css({ marginTop: '6px', color: 'var(--text-muted)' })}>
                  {t(career.description)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    )
  }
}
