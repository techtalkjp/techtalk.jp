import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { ArrowUpRightIcon } from '../icons.tsx'
import { externalLink, phrase, textLink } from '../styles.ts'
import { Section, sectionHeading, sectionLede } from '../section.tsx'
import { ProductPreview } from './product-preview.tsx'

/** 図に描いた技術検証レポートのサンプル（Artifact Share で公開しているもの） */
const SAMPLE_URLS = {
  ja: 'https://kblg7hwkv2.artifactshare.link/',
  en: 'https://0w3cy597f1.artifactshare.link/',
}

export function ProductsSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    return (
      <Section id="products" name={t('プロダクト')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('検証の結果は、')}</span>
          <span mix={phrase}>
            {t('自分で作った Artifact Share で届けています。')}
          </span>
        </h2>
        <p mix={sectionLede}>
          {t(
            '技術を試して測った結果は、レポートにして Artifact Share で共有します。気になる箇所にコメントをもらえば、答えを書き足した新しい版が同じ URL に届きます。Artifact Share は AI が作ったレポートや資料を URL ひとつで共有するサービスで、何を作るかを決めるところから開発、運営まで、ひとりで手がけています。',
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
          <ProductPreview
            locale={locale}
            label={t(
              'Artifact Share で共有した技術検証レポートのサンプル。試した技術、確かめたこと、製品の種が並び、右のコメント欄には質問と、答えを書き足して v2 に更新したという返信がある',
            )}
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
              'サンプルの技術検証レポート。コメントの質問に答えて、同じ URL のまま v2 に更新したところ',
            )}
          </figcaption>
        </figure>

        <p
          mix={css({
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '24px',
            marginTop: '24px',
          })}
        >
          <a
            href={SAMPLE_URLS[locale]}
            target="_blank"
            rel="noopener"
            mix={[textLink, externalLink]}
          >
            {t('このサンプルを開く')}
            <ArrowUpRightIcon size={13} />
          </a>
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
