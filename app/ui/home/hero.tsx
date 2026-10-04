import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import {
  caption,
  container,
  phrase,
  primaryButton,
  secondaryButton,
  wide,
} from '../styles.ts'

const career = [
  {
    year: '1999',
    org: 'ドワンゴ／ニワンゴ',
    role: '着メロやポータルの開発を率い、ニワンゴの技術担当取締役に',
  },
  {
    year: '2013',
    org: 'フリークアウト',
    role: '広告配信の入札ロジックをデータ分析で改善し、事業開発も担う',
  },
  {
    year: '2016',
    org: 'IRIS',
    role: 'タクシーサイネージ事業を2名で立ち上げ、代表取締役副社長に',
  },
  {
    year: '2019–',
    org: 'TechTalk',
    role: 'ひとり法人を設立。いまも自分でコードを書いている',
  },
]

const railBreak = '@media (max-width: 760px)'

export function HeroSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <section
        mix={css({
          padding: '64px 0 72px',
          [wide]: { padding: '104px 0 96px' },
        })}
      >
        <div mix={container}>
          <h1
            mix={css({
              fontSize: 'var(--t-display)',
              lineHeight: 1.25,
              fontWeight: 700,
              letterSpacing: '-0.025em',
            })}
          >
            <span mix={phrase}>{t('事業の構想を、')}</span>
            <span mix={phrase}>{t('動くシステムにする。')}</span>
          </h1>
          <p
            mix={css({
              marginTop: '32px',
              maxWidth: '32em',
              fontSize: '1.125rem',
              color: 'var(--text-muted)',
              '@media (min-width: 760px)': {
                fontSize: 'var(--t-20)',
                lineHeight: 1.6,
              },
            })}
          >
            {t(
              '株式会社TechTalkは、事業の立ち上げに必要な技術判断から設計・実装までを、代表がひとりで引き受けるソフトウェア会社です。',
            )}
          </p>
          <div
            mix={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '40px',
            })}
          >
            <a href="#contact" mix={primaryButton}>
              {t('相談する')}
            </a>
            <a href="#services" mix={secondaryButton}>
              {t('支援の内容を見る')}
            </a>
          </div>

          <CareerRail />
        </div>
      </section>
    )
  }
}

/** 代表の経歴を年表で見せる。いまの TechTalk だけをアクセント色にする */
function CareerRail(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <div
        mix={css({
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid var(--border)',
          [wide]: { marginTop: '96px' },
        })}
      >
        <p mix={[caption, css({ marginBottom: '28px' })]}>
          {t('代表 溝口浩二の経歴')}
        </p>
        <ol
          mix={css({
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              top: '5px',
              height: '1px',
              background: 'var(--border-strong)',
            },
            [railBreak]: {
              gridTemplateColumns: 'minmax(0, 1fr)',
              '&::before': {
                left: '5px',
                right: 'auto',
                top: '6px',
                bottom: '6px',
                width: '1px',
                height: 'auto',
              },
            },
          })}
        >
          {career.map((item, index) => {
            let now = index === career.length - 1
            return (
              <li
                key={item.year}
                aria-current={now ? 'step' : undefined}
                mix={css({
                  position: 'relative',
                  padding: '28px 24px 0 0',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    background: now ? 'var(--accent)' : 'var(--bg)',
                    boxShadow: now
                      ? '0 0 0 4px var(--accent-soft)'
                      : 'inset 0 0 0 1.5px var(--text-subtle)',
                  },
                  [railBreak]: { padding: '0 0 28px 32px' },
                })}
              >
                <p
                  mix={css({
                    fontSize: 'var(--t-14)',
                    fontVariantNumeric: 'tabular-nums',
                    color: now ? 'var(--accent)' : 'var(--text-subtle)',
                  })}
                >
                  {item.year}
                </p>
                <p
                  mix={css({
                    marginTop: '6px',
                    fontWeight: 700,
                    lineHeight: 1.5,
                  })}
                >
                  {t(item.org)}
                </p>
                <p
                  mix={css({
                    marginTop: '4px',
                    fontSize: 'var(--t-14)',
                    color: 'var(--text-muted)',
                  })}
                >
                  {t(item.role)}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }
}
