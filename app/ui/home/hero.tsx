import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import {
  container,
  fadeUpOnLoad,
  md,
  mono,
  primaryButton,
  secondaryButton,
} from '../styles.ts'

export function HeroSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    let muted = css({ lineHeight: 1.625, color: 'var(--text-muted)' })

    return (
      <section
        id="top"
        mix={[
          container,
          fadeUpOnLoad,
          css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '85vh',
            paddingBlock: '5rem',
          }),
        ]}
      >
        <div
          mix={css({ display: 'flex', flexDirection: 'column', gap: '2rem' })}
        >
          <div
            mix={css({
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-muted)',
              padding: '0.25rem 0.75rem',
              fontFamily: mono,
              fontSize: '0.75rem',
              color: 'var(--accent)',
            })}
          >
            <span
              mix={css({
                position: 'relative',
                display: 'flex',
                width: '0.5rem',
                height: '0.5rem',
              })}
            >
              <span
                mix={css({
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  background: 'var(--accent)',
                  opacity: 0.75,
                  '@media (prefers-reduced-motion: no-preference)': {
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                  },
                })}
              />
              <span
                mix={css({
                  position: 'relative',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  background: 'var(--accent)',
                })}
              />
            </span>
            {t('Strategic Implementation')}
          </div>

          <h1
            mix={css({
              fontSize: '3rem',
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: 'var(--text-strong)',
              [md]: { fontSize: '4.5rem' },
            })}
          >
            {t('Implement Your Business.')}
            <br />
            <span
              mix={css({
                backgroundImage:
                  'linear-gradient(to right, var(--accent), var(--accent-indigo))',
                backgroundClip: 'text',
                color: 'transparent',
              })}
            >
              {t('Deliver Through Code.')}
            </span>
          </h1>

          <p
            mix={css({
              maxWidth: '42rem',
              fontSize: '1.125rem',
              lineHeight: 1.625,
              fontWeight: 300,
              color: 'var(--text-muted)',
              [md]: { fontSize: '1.25rem' },
            })}
          >
            {t('戦略を描くだけでなく、動くシステムとして実装する。')}
            <br />
            {t(
              'アドテクの事業開発から、タクシーサイネージのハードウェア統合まで。',
            )}
            <br mix={css({ display: 'none', [md]: { display: 'block' } })} />
            {t('TechTalkは技術と事業の両面から0→1を生み出してきました。')}
          </p>

          <div
            mix={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '2rem',
            })}
          >
            <a href="#contact" mix={primaryButton}>
              {t('お問い合わせ')}
            </a>
            <a href="#services" mix={secondaryButton}>
              {t('サービス詳細')}
            </a>
          </div>
        </div>

        <div
          mix={css({
            marginTop: '6rem',
            display: 'grid',
            alignItems: 'start',
            gap: '2rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '3rem',
            [md]: {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '3rem',
            },
          })}
        >
          <div>
            <h2
              mix={css({
                marginBottom: '1rem',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-strong)',
              })}
            >
              {t('TechTalkの提供価値')}
            </h2>
            <p mix={muted}>
              {t(
                '株式会社TechTalkは、技術と事業の両方を理解した上で実装を行う会社です。多くのコンサルティング会社が戦略立案や技術顧問といった抽象的な価値提案に終始する中で、TechTalkは実際に動くシステムを構築します。',
              )}
            </p>
          </div>
          <p mix={[muted, css({ [md]: { marginTop: '3rem' } })]}>
            {t(
              '代表の溝口浩二は現在もコードを書き続けており、経営判断と技術実装の両方に責任を持ちます。事業開発から立ち上げまでの経験が、複合的な実装力の源泉です。',
            )}
          </p>
        </div>
      </section>
    )
  }
}
