import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { Section, sectionHeading, sectionLede } from '../section.tsx'
import { medium, phrase } from '../styles.ts'

/** 相談に来る経営者がよく抱えている状況と、それへの応え方 */
const cases = [
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
        <p mix={sectionLede}>
          {t(
            '新しい事業を始めようとしている経営者や事業責任者の方から、よくうかがう状況です。',
          )}
        </p>
        <ul
          // リストの見た目を消すと Safari の読み上げがリストとして扱わなくなるので、明示する
          role="list"
          mix={css({ marginTop: '40px', borderTop: '1px solid var(--border)' })}
        >
          {cases.map((item) => (
            <li
              key={item.situation}
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '6px',
                padding: '24px 0',
                borderBottom: '1px solid var(--border)',
                [medium]: {
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
                  gap: '32px',
                },
              })}
            >
              <h3 mix={css({ fontSize: 'var(--t-16)', lineHeight: 1.6 })}>
                {t(item.situation)}
              </h3>
              <p mix={css({ color: 'var(--text-muted)' })}>{t(item.answer)}</p>
            </li>
          ))}
        </ul>
      </Section>
    )
  }
}
