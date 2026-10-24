import { css, type Handle } from 'remix/component'

import type { MessageKey } from '../../i18n/index.ts'
import { getI18n } from '../../i18n/provider.tsx'
import { ArrowUpRightIcon } from '../icons.tsx'
import { Section, sectionHeading, sectionLede } from '../section.tsx'
import { externalLink, phrase, textLink, wide } from '../styles.ts'
import { ProductPreview } from './product-preview.tsx'

/** 技術検証レポートのサンプル（Artifact Share で公開しているもの） */
const SAMPLE_URLS = {
  ja: 'https://kblg7hwkv2.artifactshare.link/',
  en: 'https://0w3cy597f1.artifactshare.link/',
}

const steps: { title: MessageKey; body: MessageKey }[] = [
  {
    title: '誰に、何を届けるかを考える',
    body: '技術の種を使って、どんな顧客の、どんな課題を解決し、どんな価値を届けられるかを一緒に考えます。',
  },
  {
    title: '試して確かめる',
    body: 'その技術で本当にできるかを、小さく試して測ります。結果はレポートにして共有し、製品になりそうな種を選びます。',
  },
  {
    title: '最初のバージョンを作る',
    body: '選んだ種を、顧客に見せられる動くものにします。反応を見ながら、次に何を確かめるかを一緒に決めます。',
  },
]

export function ApproachSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    return (
      <Section id="approach" name={t('進め方')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('何を作るかは、')}</span>
          <span mix={phrase}>{t('話して、試してから')}</span>
          <span mix={phrase}>{t('決める。')}</span>
        </h2>
        <p mix={sectionLede}>
          {t(
            '最初から仕様は決めません。技術の種から、どんな事業になるかを探すところから始めます。',
          )}
        </p>

        <ol
          // リストの見た目を消すと Safari の読み上げがリストとして扱わなくなるので、明示する
          role="list"
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '40px',
            marginTop: '40px',
            [wide]: {
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '48px',
              marginTop: '56px',
            },
          })}
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              mix={css({
                position: 'relative',
                display: 'grid',
                alignContent: 'start',
                gridTemplateColumns: '40px minmax(0, 1fr)',
                columnGap: '20px',
                // 次の段へつなぐ線。狭いときは番号の下へ縦に、広いときは番号の右へ横に引く
                '&:not(:last-child)::after': {
                  content: '""',
                  position: 'absolute',
                  left: '20px',
                  top: '52px',
                  bottom: '-28px',
                  width: '1px',
                  background: 'var(--border-strong)',
                },
                [wide]: {
                  gridTemplateColumns: 'minmax(0, 1fr)',
                  rowGap: '20px',
                  '&:not(:last-child)::after': {
                    left: '56px',
                    right: '-36px',
                    top: '20px',
                    bottom: 'auto',
                    width: 'auto',
                    height: '1px',
                  },
                },
              })}
            >
              {/* 順番は ol が伝えるので、読み上げには出さない */}
              <span
                aria-hidden="true"
                mix={css({
                  display: 'grid',
                  placeItems: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  boxShadow: 'inset 0 0 0 1px var(--accent)',
                  color: 'var(--accent)',
                  fontSize: 'var(--t-14)',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                })}
              >
                {index + 1}
              </span>
              <div>
                <h3
                  mix={css({
                    fontSize: 'var(--t-20)',
                    lineHeight: 1.5,
                    paddingTop: '6px',
                    [wide]: { paddingTop: 0 },
                  })}
                >
                  {t(step.title)}
                </h3>
                <p mix={css({ marginTop: '10px', color: 'var(--text-muted)' })}>
                  {t(step.body)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* 2 番目の手順で届けるレポートの実物。Artifact Share は売り物としてではなく、届け方として見せる */}
        <figure
          aria-label={t('プロダクト')}
          mix={css({ marginTop: '64px', [wide]: { marginTop: '80px' } })}
        >
          <div
            mix={css({
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
          </div>
          <figcaption
            mix={css({
              display: 'grid',
              gap: '8px',
              marginTop: '20px',
            })}
          >
            <p mix={css({ fontWeight: 700, color: 'var(--text-strong)' })}>
              <span mix={phrase}>{t('検証の結果は、')}</span>
              <span mix={phrase}>
                {/* 製品名の途中で折り返さない */}
                {t('自分で作った Artifact Share で届けています。').replace(
                  'Artifact Share',
                  'Artifact\u00a0Share',
                )}
              </span>
            </p>
            <p mix={css({ color: 'var(--text-muted)' })}>
              {t(
                'サンプルの技術検証レポート。コメントの質問に答えて、同じ URL のまま v2 に更新したところ',
              )}
            </p>
            <p
              mix={css({
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: '24px',
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
          </figcaption>
        </figure>

        <div
          mix={css({
            marginTop: '64px',
            maxWidth: '44em',
            padding: '20px 24px',
            background: 'var(--surface)',
            // 強制カラーモードでも枠が残るよう、box-shadow ではなく border で描く
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-control)',
          })}
        >
          <h3
            mix={css({
              marginBottom: '6px',
              fontSize: 'var(--t-14)',
              fontWeight: 700,
            })}
          >
            {t('お受けしていないご依頼')}
          </h3>
          <p mix={css({ fontSize: 'var(--t-14)', color: 'var(--text-muted)' })}>
            {t(
              '仕様が決まっていて開発だけを頼みたい場合や、常駐・人月単位での契約はお受けしていません。作るものから一緒に決める進め方をとっているためです。',
            )}
          </p>
        </div>
      </Section>
    )
  }
}
