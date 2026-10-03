import { css, type Handle, type RemixNode } from 'remix/component'

import { otherLocale, type I18n } from '../../i18n/index.ts'
import { paths } from '../../paths.ts'
import { getI18n, I18nProvider } from '../../i18n/provider.tsx'
import { Document, type Seo } from '../document.tsx'
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  FacebookIcon,
  GithubIcon,
  TwitterIcon,
} from '../icons.tsx'
import { LanguageLink, PageShell, ThemeSwitcher } from '../layout.tsx'
import { fadeUpOnLoad, md, narrowContainer, sm } from '../styles.ts'

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
      'エンジニア、プログラマーとしてキャリアをスタート。着メロサービス、動画サービス、ポータルサイトなどのエンジニアリングマネージャーを経験。ニワンゴでは技術担当取締役を担当。',
  },
]

const articles = [
  {
    href: 'https://forbesjapan.com/articles/detail/22941',
    image:
      'https://shareboss.net/wp-content/uploads/2019/11/c0ef11a7611e6c1a64940ca869d9adf5.jpg',
    publisher: 'Forbes JAPAN',
    title: '合弁会社で世界へ タクシーメディアの掲げる野望',
  },
  {
    href: 'https://thebridge.jp/2014/06/takanori-oshiba-interview-series-vol-7',
    image: 'https://thebridge.jp/wp-content/uploads/2014/06/freakout1.jpg',
    publisher: 'THE BRIDGE',
    title:
      '「本田の描く広告の未来を実現する」ーー隠れたキーマンを調べるお・フリークアウト、溝口氏インタビュー',
  },
  {
    href: 'https://japan.cnet.com/article/20361283/',
    image:
      'https://japan.cnet.com/story_media/20361283/CNETJ/071117_niwango2.jpg',
    publisher: 'CNET Japan',
    title: 'ニワンゴ技術責任者が語る、「ニコニコ動画」成功の鍵',
  },
]

const socials: { href: string; label: string; icon: () => RemixNode }[] = [
  {
    href: 'https://x.com/techtalkjp',
    label: 'X',
    icon: () => <TwitterIcon size={20} />,
  },
  {
    href: 'https://www.facebook.com/mizoguchi.coji',
    label: 'Facebook',
    icon: () => <FacebookIcon size={20} />,
  },
  {
    href: 'https://github.com/coji',
    label: 'GitHub',
    icon: () => <GithubIcon size={20} />,
  },
]

const sectionLabel = css({
  marginBottom: '3rem',
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: 'var(--text-subtle)',
})

const cardStyle = css({
  borderRadius: '1rem',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  transition: 'border-color 150ms, background-color 150ms',
  '&:hover': {
    borderColor: 'var(--border-strong)',
    background: 'var(--surface-hover)',
  },
})

const sectionStyle = css({
  borderTop: '1px solid var(--border)',
  paddingBlock: '6rem',
})

export function BiographyPage(handle: Handle<{ i18n: I18n }>) {
  return () => {
    let { i18n } = handle.props
    return (
      <Document locale={i18n.locale} seo={biographySeo(i18n)}>
        <I18nProvider value={i18n}>
          <PageShell>
            <div mix={css({ position: 'relative', zIndex: 10 })}>
              <BiographyNav
                languageHref={paths.biography(otherLocale(i18n.locale))}
              />
              <BiographyHero />
              <SocialLinks />
              <CareerTimeline />
              <MediaCoverage />
            </div>
          </PageShell>
        </I18nProvider>
      </Document>
    )
  }
}

function BiographyNav(handle: Handle<{ languageHref: string }>) {
  return () => {
    let { t, locale } = getI18n(handle)
    return (
      <nav mix={css({ borderBottom: '1px solid var(--border)' })}>
        <div
          mix={[
            narrowContainer,
            css({
              maxWidth: '80rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBlock: '1rem',
            }),
          ]}
        >
          <a
            href={paths.home(locale)}
            mix={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              transition: 'color 150ms',
              '&:hover': { color: 'var(--text-strong)' },
            })}
          >
            <ArrowLeftIcon size={16} />
            {t('トップへ戻る')}
          </a>
          <div
            mix={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}
          >
            <ThemeSwitcher />
            <LanguageLink href={handle.props.languageHref} />
          </div>
        </div>
      </nav>
    )
  }
}

function BiographyHero(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <section mix={css({ paddingBlock: '6rem' })}>
        <div
          mix={[narrowContainer, fadeUpOnLoad, css({ textAlign: 'center' })]}
        >
          <div
            mix={css({
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
            })}
          >
            <img
              src="/images/coji.webp"
              alt="Coji Mizoguchi"
              width={128}
              height={128}
              mix={css({
                width: '8rem',
                height: '8rem',
                borderRadius: '9999px',
                border: '4px solid var(--border)',
              })}
            />
          </div>
          <h1
            mix={css({
              marginBottom: '1rem',
              fontSize: '3rem',
              fontWeight: 700,
              color: 'var(--text-strong)',
              [md]: { fontSize: '3.75rem' },
            })}
          >
            {t('Coji Mizoguchi')}
          </h1>
          <p
            mix={css({
              marginBottom: '2rem',
              fontSize: '1.25rem',
              color: 'var(--text-body)',
              [md]: { fontSize: '1.5rem' },
            })}
          >
            {t('溝口 浩二')}
          </p>
          <p
            mix={css({
              maxWidth: '42rem',
              marginInline: 'auto',
              fontSize: '1.125rem',
              color: 'var(--text-muted)',
            })}
          >
            {t('技術と事業の両面から0→1を生み出す')}
          </p>
        </div>
      </section>
    )
  }
}

function SocialLinks(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <section mix={[sectionStyle, css({ paddingBlock: '3rem' })]}>
        <div mix={narrowContainer}>
          <h2 mix={[sectionLabel, css({ marginBottom: '1.5rem' })]}>
            {t('CONNECT')}
          </h2>
          <div
            mix={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              [sm]: { flexDirection: 'row', gap: '1rem' },
            })}
          >
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                mix={[
                  cardStyle,
                  css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    color: 'var(--text-strong)',
                  }),
                ]}
              >
                {social.icon()}
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

function CareerTimeline(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <section mix={sectionStyle}>
        <div mix={narrowContainer}>
          <h2 mix={sectionLabel}>{t('CAREER')}</h2>
          <div
            mix={css({ display: 'flex', flexDirection: 'column', gap: '2rem' })}
          >
            {careers.map((career) => (
              <div
                key={career.title}
                mix={[cardStyle, css({ padding: '2rem' })]}
              >
                <div
                  mix={css({
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-subtle)',
                  })}
                >
                  {t(career.period)}
                </div>
                <h3
                  mix={css({
                    marginBottom: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--text-strong)',
                  })}
                >
                  {t(career.title)}
                </h3>
                <p mix={css({ lineHeight: 1.625, color: 'var(--text-muted)' })}>
                  {t(career.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

function MediaCoverage(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <section mix={sectionStyle}>
        <div mix={narrowContainer}>
          <h2 mix={sectionLabel}>{t('MEDIA COVERAGE')}</h2>
          <div
            mix={css({
              display: 'grid',
              gap: '1.5rem',
              [md]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
            })}
          >
            {articles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                mix={[
                  cardStyle,
                  css({
                    display: 'block',
                    overflow: 'hidden',
                    '&:hover img': { transform: 'scale(1.05)' },
                  }),
                ]}
              >
                <div mix={css({ aspectRatio: '16 / 9', overflow: 'hidden' })}>
                  <img
                    src={article.image}
                    alt={t(article.title)}
                    loading="lazy"
                    mix={css({
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 300ms',
                    })}
                  />
                </div>
                <div mix={css({ padding: '1.5rem' })}>
                  <div
                    mix={css({
                      marginBottom: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-subtle)',
                    })}
                  >
                    {t(article.publisher)}
                  </div>
                  <h3
                    mix={css({
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-strong)',
                    })}
                  >
                    {t(article.title)}
                  </h3>
                  <div
                    mix={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-subtle)',
                    })}
                  >
                    <span>Read more</span>
                    <ExternalLinkIcon size={12} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    )
  }
}
