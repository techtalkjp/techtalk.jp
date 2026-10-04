import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { ArrowUpRightIcon } from '../icons.tsx'
import { externalLink, phrase, textLink } from '../styles.ts'
import { Section, sectionHeading, sectionLede } from '../section.tsx'

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
      <Section id="products" name={t('プロダクト')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('同じやり方で、')}</span>
          <span mix={phrase}>{t('自社の事業も動かしています。')}</span>
        </h2>
        <p mix={sectionLede}>
          {t(
            'Artifact Shareは、AIが作ったレポートや資料をURLひとつで共有するサービスです。何を作るかを決めるところから開発、運営まで、代表がひとりで手がけています。',
          )}
        </p>

        <figure
          mix={css({
            margin: '48px 0 0',
            borderRadius: 'var(--r-image)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-image)',
            background: 'var(--surface)',
          })}
        >
          <img
            src={shot.src}
            width={shot.width}
            height={shot.height}
            loading="lazy"
            decoding="async"
            alt={t(
              'Artifact Shareで共有した月次売上レポートの画面。版番号と閲覧数が表示されている',
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
              'サンプルのレポートを共有した画面。同じURLのまま版を重ねて更新できる',
            )}
          </figcaption>
        </figure>

        <p mix={css({ marginTop: '24px' })}>
          <a
            href="https://artifactshare.com"
            target="_blank"
            rel="noopener"
            mix={[textLink, externalLink]}
          >
            {t('artifactshare.comを見る')}
            <ArrowUpRightIcon size={13} />
          </a>
        </p>
      </Section>
    )
  }
}
