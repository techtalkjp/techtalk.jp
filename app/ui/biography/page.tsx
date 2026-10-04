import { css, type Handle } from 'remix/component'

import { otherLocale, type I18n, type MessageKey } from '../../i18n/index.ts'
import { paths } from '../../paths.ts'
import { getI18n, I18nProvider } from '../../i18n/provider.tsx'
import { Document, type Seo } from '../document.tsx'
import { PageShell } from '../layout.tsx'
import { PageIntro } from '../page-intro.tsx'
import { PressList } from '../press-list.tsx'
import { ProfileLinks, ProfilePhoto } from '../profile-parts.tsx'
import { Section } from '../section.tsx'
import { medium } from '../styles.ts'

function biographySeo({ locale }: I18n): Seo {
  let ja = locale === 'ja'
  return {
    title: ja
      ? '溝口 浩二 - Biography | TechTalk, Inc.'
      : 'Coji Mizoguchi - Biography | TechTalk, Inc.',
    description: ja
      ? '株式会社TechTalk 代表取締役 溝口浩二の経歴。ドワンゴ、フリークアウト、IRISで技術と経営の間を行き来し、いまは作る前の段階から経営者と話して新しい事業を形にしています。'
      : 'Coji Mizoguchi, CEO of TechTalk. He moved between technology and management at Dwango, FreakOut, and IRIS, and now shapes new businesses with their owners.',
    path: paths.biography(locale),
    ogType: 'profile',
    alternates: { ja: paths.biography('ja'), en: paths.biography('en') },
  }
}

const careers: {
  period: MessageKey
  title: MessageKey
  description: MessageKey
}[] = [
  {
    period: '2019年 - 現在',
    title: '株式会社TechTalk 代表取締役',
    description:
      '経営者と直接話し、事業になるかを一緒に見極めて、最初の版まで自分で作る。化学物質の検索システム、AIを使った試作、データの集計基盤などを手がける。自社プロダクトArtifact Shareも開発・運営。',
  },
  {
    period: '2016年 - 2019年',
    title: '株式会社IRIS 代表取締役副社長',
    description:
      'FreakOut在籍中に、JapanTaxiとの合弁会社として設立。タクシーサイネージ事業を2名で立ち上げ、事業計画と経営から、ハードウェア、動画広告、配信システムの統合までを担う。',
  },
  {
    period: '2013年 - 2019年',
    title: '株式会社FreakOut（現 株式会社フリークアウト・ホールディングス）',
    description:
      '技術をもとにした事業開発とアライアンスに従事。DSP（広告枠を自動で買い付ける仕組み）の入札ロジックづくりでは、事業の要件を数値に落とし込み、機械学習チームとの橋渡しを担当。',
  },
  {
    period: '1999年 - 2013年',
    title: '株式会社ドワンゴ / 株式会社ニワンゴ',
    description:
      'プログラマーとしてキャリアをスタート。着メロサービスやポータルサイトの開発責任者のほか、経営企画室長、新規事業の企画開発部長を務める。ニワンゴでは技術担当の取締役。',
  },
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
              <Section id="press" name={i18n.t('掲載記事')} nameIsHeading>
                <PressList />
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
          <div mix={css({ marginBottom: '32px' })}>
            <ProfilePhoto alt={t('溝口浩二の写真')} />
          </div>
        }
        title={t('溝口 浩二')}
        lede={t(
          '株式会社TechTalk 代表取締役。プログラマーから経営企画、合弁会社の副社長まで、技術と経営の間を行き来してきました。作ったものが事業にならない経験を重ねたことが、いまの仕事のしかたにつながっています。',
        )}
      >
        <div mix={css({ marginTop: '24px' })}>
          <ProfileLinks />
        </div>
      </PageIntro>
    )
  }
}

function CareerSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <Section id="career" name={t('経歴')} nameIsHeading>
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
                '&:first-child': { paddingTop: 0 },
                [medium]: {
                  gridTemplateColumns: '160px minmax(0, 1fr)',
                  alignItems: 'baseline',
                  gap: '24px',
                },
              })}
            >
              <p
                mix={css({
                  fontSize: 'var(--t-14)',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--text-subtle)',
                })}
              >
                {t(career.period)}
              </p>
              <div>
                <h3 mix={css({ fontSize: 'var(--t-16)', lineHeight: 1.6 })}>
                  {t(career.title)}
                </h3>
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
