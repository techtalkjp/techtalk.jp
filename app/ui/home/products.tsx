import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { ArrowUpRightIcon } from '../icons.tsx'
import { phrase, sm, textLink } from '../styles.ts'
import { Section, sectionHeading, sectionLede } from './section.tsx'

const features = [
  {
    title: 'すぐに共有できる',
    description:
      'HTML、Markdown、静的サイトを、閲覧用の安定したURLで共有できます。',
  },
  {
    title: '同じURLで更新できる',
    description:
      '成果物を更新しても共有先はそのまま。レビューと改善を続けられます。',
  },
  {
    title: 'AIエージェントから使える',
    description:
      'Web、CLI、MCPから、人とAIエージェントのどちらでも操作できます。',
  },
  {
    title: '共有範囲を選べる',
    description: '公開、ワークスペース内、個別の共有を、用途に応じて選べます。',
  },
]

/** 画面写真は Artifact Share のサイトと同じもの。ロケールごとに UI の言語が違う */
const screenshots = {
  ja: { src: '/images/artifact-share-ja.webp', width: 1493, height: 1260 },
  en: { src: '/images/artifact-share-en.webp', width: 1600, height: 1163 },
}

export function ProductsSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    let shot = screenshots[locale]
    return (
      <Section id="product" name={t('プロダクト')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('自社サービスArtifact Shareを、')}</span>
          <span mix={phrase}>{t('企画から運営まで手がけています。')}</span>
        </h2>
        <p mix={sectionLede}>
          {t(
            'AIエージェントや開発ツールで作ったレポート、ドキュメント、Webサイトを、URLひとつで共有するサービスです。レビューを受けながら、同じURLのまま更新し続けられます。',
          )}
        </p>

        <figure
          mix={css({
            margin: '48px 0 0',
            borderRadius: 'var(--r-image)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-image)',
            background: '#fcfaf8',
          })}
        >
          <img
            src={shot.src}
            width={shot.width}
            height={shot.height}
            loading="lazy"
            decoding="async"
            alt={t(
              'Artifact Shareで共有した月次売上レポートの画面。版番号、閲覧数、コメント数が表示されている',
            )}
            mix={css({
              width: '100%',
              // 画面写真はライト UI しかないので、ダークでは少し落として白く浮かせない
              '@media (prefers-color-scheme: dark)': {
                filter: 'brightness(0.86) contrast(1.04)',
              },
            })}
          />
          <figcaption
            mix={css({
              padding: '12px 16px',
              fontSize: 'var(--t-12)',
              color: 'var(--text-subtle)',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
            })}
          >
            {t(
              'サンプルのレポートを共有した画面。同じURLのまま更新した版番号と、届いたコメントの数が並ぶ',
            )}
          </figcaption>
        </figure>

        <ul
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            marginTop: '48px',
            borderTop: '1px solid var(--border)',
            [sm]: {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              columnGap: '40px',
            },
          })}
        >
          {features.map((feature) => (
            <li
              key={feature.title}
              mix={css({
                padding: '20px 0',
                borderBottom: '1px solid var(--border)',
              })}
            >
              <h3 mix={css({ fontSize: 'var(--t-16)', lineHeight: 1.6 })}>
                {t(feature.title)}
              </h3>
              <p
                mix={css({
                  marginTop: '4px',
                  fontSize: 'var(--t-14)',
                  color: 'var(--text-muted)',
                })}
              >
                {t(feature.description)}
              </p>
            </li>
          ))}
        </ul>

        <p mix={css({ marginTop: '24px' })}>
          <a
            href="https://artifactshare.com"
            target="_blank"
            rel="noopener"
            mix={[textLink, externalLink]}
          >
            {t('artifactshare.comで詳しく見る')}
            <ArrowUpRightIcon size={13} />
          </a>
        </p>
      </Section>
    )
  }
}

/** 外部リンク。文字の後ろに小さな矢印を添え、押しやすいよう上下に余白をとる */
export const externalLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  paddingBlock: '10px',
})
