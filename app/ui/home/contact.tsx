import { css, type Handle } from 'remix/component'

import { MESSENGER_URL } from '../../config.ts'
import type { MessageKey } from '../../i18n/index.ts'
import { getI18n } from '../../i18n/provider.tsx'
import { ArrowUpRightIcon } from '../icons.tsx'
import { Section, sectionHeading } from '../section.tsx'
import { medium, phrase, primaryButton, wide } from '../styles.ts'

/** 最初のメッセージに書いてほしいこと。順番はないので番号は振らない */
const firstMessage: MessageKey[] = [
  '考えている事業のこと',
  'いま困っていること',
  'お名前と会社名',
]

/**
 * トップの問い合わせセクション。フォームは営業の送信ばかりになったので閉じ、
 * 代表の Facebook に Messenger で直接送ってもらう
 */
export function ContactSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)

    return (
      <Section id="contact" name={t('お問い合わせ')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('事業の話を、')}</span>
          <span mix={phrase}>{t('そのまま聞かせてください。')}</span>
        </h2>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '32px',
            marginTop: '20px',
            [wide]: {
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
              gap: '64px',
              marginTop: '24px',
            },
          })}
        >
          <div>
            <p mix={noteStyle}>
              {t(
                '新しい事業の構想、技術でできるかどうか、進め方などのご相談を、まだ形になっていない段階からうかがいます。',
              )}
            </p>
            <p mix={noteStyle}>{t('代表の溝口が自分で読んで返信します。')}</p>
          </div>

          <div
            mix={css({
              alignSelf: 'start',
              padding: '24px',
              borderRadius: 'var(--r-image)',
              background: 'var(--surface)',
              boxShadow: 'inset 0 0 0 1px var(--border)',
              [medium]: { padding: '32px' },
              '@media (forced-colors: active)': {
                border: '1px solid CanvasText',
              },
            })}
          >
            <div
              mix={css({ display: 'flex', alignItems: 'center', gap: '16px' })}
            >
              <img
                src="/images/coji.webp"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                alt=""
                mix={css({
                  flex: 'none',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 0 0 1px var(--border-strong)',
                })}
              />
              <div>
                <p
                  mix={css({
                    fontSize: 'var(--t-18)',
                    fontWeight: 700,
                    lineHeight: 1.4,
                  })}
                >
                  {t('溝口 浩二')}
                </p>
                <p
                  mix={css({
                    marginTop: '2px',
                    fontSize: 'var(--t-14)',
                    color: 'var(--text-subtle)',
                  })}
                >
                  Facebook Messenger
                </p>
              </div>
            </div>

            <h3
              mix={css({
                marginTop: '28px',
                fontSize: 'var(--t-14)',
                fontWeight: 700,
                color: 'var(--accent)',
              })}
            >
              {t('最初のメッセージは、これだけで十分です')}
            </h3>
            <ul role="list" mix={css({ marginTop: '8px' })}>
              {firstMessage.map((item) => (
                <li
                  key={item}
                  mix={css({
                    paddingBlock: '10px',
                    lineHeight: 1.6,
                    '& + &': { borderTop: '1px solid var(--border)' },
                  })}
                >
                  {t(item)}
                </li>
              ))}
            </ul>

            <div mix={css({ marginTop: '20px' })}>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noopener"
                mix={[
                  primaryButton,
                  css({ width: '100%', [medium]: { width: 'auto' } }),
                ]}
              >
                {t('Messenger でメッセージを送る')}
                <ArrowUpRightIcon size={14} />
              </a>
              <p
                mix={css({
                  marginTop: '12px',
                  fontSize: 'var(--t-14)',
                  lineHeight: 1.6,
                  color: 'var(--text-subtle)',
                })}
              >
                {t(
                  'Facebook のアカウントがあれば、友達になっていなくても送れます。',
                )}
              </p>
            </div>
          </div>
        </div>
      </Section>
    )
  }
}

const noteStyle = css({
  maxWidth: '30em',
  color: 'var(--text-muted)',
  '& + &': { marginTop: '12px' },
})
