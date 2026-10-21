import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { ArrowUpRightIcon } from '../icons.tsx'
import {
  container,
  externalLink,
  medium,
  phrase,
  primaryButton,
  secondaryButton,
  textLink,
  wide,
} from '../styles.ts'
import { ProductPreview } from './product-preview.tsx'

/** 1 画面目に描いた技術検証レポートのサンプル（Artifact Share で公開しているもの） */
const SAMPLE_URLS = {
  ja: 'https://kblg7hwkv2.artifactshare.link/',
  en: 'https://0w3cy597f1.artifactshare.link/',
}

/**
 * トップの 1 画面目。中央に見出しと相談ボタン、その下に代表と「経営」「開発」の経歴を 1 行で置き、
 * 下端から Artifact Share で届けた技術検証レポートの画面が、青い光を背にせり上がる
 */
export function HeroSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    return (
      <div mix={css({ position: 'relative', overflow: 'hidden' })}>
        <div
          mix={[
            container,
            css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              paddingTop: '72px',
              [wide]: { paddingTop: '104px' },
            }),
          ]}
        >
          <h1
            mix={css({
              fontSize: 'var(--t-display)',
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: '-0.035em',
            })}
          >
            <span mix={phrase}>{t('技術の話から、')}</span>
            <span mix={phrase}>{t('新しい事業をつくる。')}</span>
          </h1>
          <p
            mix={css({
              marginTop: '24px',
              maxWidth: '44em',
              textWrap: 'balance',
              fontSize: 'var(--t-18)',
              color: 'var(--text-muted)',
              [medium]: { fontSize: 'var(--t-20)', lineHeight: 1.6 },
            })}
          >
            {t(
              '経営と開発の両方を経験した代表が、構想から動く最初のバージョンまで一緒につくります。',
            )}
          </p>
          <div
            mix={css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '36px',
            })}
          >
            <a href="#contact" mix={primaryButton}>
              {t('相談する')}
            </a>
            <a href="#approach" mix={secondaryButton}>
              {t('進め方を見る')}
            </a>
          </div>

          <Founder />
        </div>

        <div
          mix={css({
            position: 'relative',
            marginTop: '56px',
            [wide]: { marginTop: '72px' },
            // 画面の後ろの光。ぼかしは使わず、グラデーションだけで描く
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '-120px 0 auto',
              height: '640px',
              background:
                'radial-gradient(ellipse 48% 56% at 50% 50%, var(--glow), transparent 70%)',
              pointerEvents: 'none',
            },
          })}
        >
          <figure
            id="products"
            aria-label={t('プロダクト')}
            mix={[
              container,
              css({
                position: 'relative',
                '@media (prefers-reduced-motion: no-preference)': {
                  animation: 'rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
                },
              }),
            ]}
          >
            <div
              mix={css({
                borderRadius: 'var(--r-image)',
                overflow: 'hidden',
                // 枠の上端から漏れる光で、画面が光を背にしているように見せる
                boxShadow:
                  '0 -40px 72px -36px var(--glow), var(--shadow-image)',
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
                justifyItems: 'center',
                gap: '8px',
                marginTop: '28px',
                textAlign: 'center',
              })}
            >
              <h2
                mix={css({
                  fontSize: 'var(--t-20)',
                  lineHeight: 1.5,
                  fontWeight: 700,
                  [medium]: { fontSize: 'var(--t-28)' },
                })}
              >
                <span mix={phrase}>{t('検証の結果は、')}</span>
                <span mix={phrase}>
                  {/* 製品名の途中で折り返さない */}
                  {t('自分で作った Artifact Share で届けています。').replace(
                    'Artifact Share',
                    'Artifact\u00a0Share',
                  )}
                </span>
              </h2>
              <p
                mix={css({
                  maxWidth: '36em',
                  color: 'var(--text-muted)',
                  textWrap: 'balance',
                })}
              >
                {t(
                  'サンプルの技術検証レポート。コメントの質問に答えて、同じ URL のまま v2 に更新したところ',
                )}
              </p>
              <p
                mix={css({
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
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
        </div>
      </div>
    )
  }
}

/** 代表の写真と名前。肩書きを並べず、話を聞く人がそのまま作ることだけを添える */
function Founder(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <div
        mix={css({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '40px',
          textAlign: 'left',
          fontSize: 'var(--t-16)',
        })}
      >
        <img
          src="/images/coji.webp"
          width={48}
          height={48}
          alt=""
          mix={css({
            flexShrink: 0,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            boxShadow: '0 0 0 1px var(--border-strong)',
          })}
        />
        <p mix={css({ lineHeight: 1.5 })}>
          <span
            mix={css({
              display: 'block',
              fontWeight: 700,
              color: 'var(--text-strong)',
            })}
          >
            {t('代表 溝口 浩二')}
          </span>
          <span mix={css({ display: 'block', color: 'var(--text-muted)' })}>
            {t('話を聞く人と、作る人が同じです。')}
          </span>
        </p>
      </div>
    )
  }
}
