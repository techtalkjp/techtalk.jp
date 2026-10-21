import { css, type Handle } from 'remix/component'

import type { MessageKey } from '../../i18n/index.ts'
import { getI18n } from '../../i18n/provider.tsx'
import { Section, sectionHeading } from '../section.tsx'
import { medium, phrase, wide } from '../styles.ts'

/** 相談に来る経営者がよく抱えている状況と、それへの応え方 */
const cases: { situation: MessageKey; answer: MessageKey }[] = [
  {
    situation: 'アイデアはあるが、技術的にできるのか見当がつかない',
    answer:
      '話をうかがいながら、できることと難しいこと、最初に試すことを整理していきます。',
  },
  {
    situation: '開発会社に相談したら、まず仕様書を求められた',
    answer:
      '仕様書がなくてもかまいません。何を売るかをうかがい、何を作るかを決めるところから一緒に始めます。',
  },
  {
    situation: '社内に、技術の判断を任せられる人がいない',
    answer:
      '技術の選択肢を、費用や時間、事業への影響に置き換えてお話しするので、経営の判断として決められます。',
  },
]

export function CasesSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <Section id="when" name={t('こんなとき')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('技術のことを、')}</span>
          <span mix={phrase}>{t('経営の言葉で相談したいとき。')}</span>
        </h2>
        <ul
          // リストの見た目を消すと Safari の読み上げがリストとして扱わなくなるので、明示する
          role="list"
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            marginTop: '48px',
            borderTop: '1px solid var(--border)',
            [wide]: {
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              marginTop: '64px',
            },
          })}
        >
          {cases.map((item) => (
            <li
              key={item.situation}
              mix={css({
                padding: '28px 0',
                borderBottom: '1px solid var(--border)',
                [wide]: {
                  padding: '32px 40px 0 0',
                  borderBottom: 0,
                  '& + &': {
                    paddingLeft: '40px',
                    borderLeft: '1px solid var(--border)',
                  },
                },
              })}
            >
              <h3
                mix={css({
                  fontSize: 'var(--t-18)',
                  lineHeight: 1.55,
                  [medium]: { fontSize: 'var(--t-20)' },
                })}
              >
                {t(item.situation)}
              </h3>
              <p mix={css({ marginTop: '12px', color: 'var(--text-muted)' })}>
                {t(item.answer)}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    )
  }
}
