import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import {
  container,
  medium,
  phrase,
  primaryButton,
  secondaryButton,
  wide,
} from '../styles.ts'

/**
 * トップの 1 画面目。中央に見出しと相談ボタン、その下に代表を置き、
 * 下端に技術の種が製品になるまでを描いた画像を敷く
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

        {/* 原石（技術の種）が、切り出され、光る完成品になるまでを描いた生成画像。
            四辺はページの地の色に溶かしてある。飾りなので読み上げない */}
        <picture>
          <source
            srcset="/images/hero-dark.webp"
            media="(prefers-color-scheme: dark)"
          />
          <img
            src="/images/hero-light.webp"
            alt=""
            width={1600}
            height={560}
            fetchpriority="high"
            decoding="async"
            mix={css({
              display: 'block',
              width: '100%',
              maxWidth: '1600px',
              marginInline: 'auto',
              marginTop: '24px',
              [wide]: { marginTop: '8px' },
              '@media (prefers-reduced-motion: no-preference)': {
                animation: 'rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
              },
            })}
          />
        </picture>
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
