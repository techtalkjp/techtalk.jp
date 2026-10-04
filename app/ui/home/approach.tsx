import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { Section, sectionHeading, sectionLede } from '../section.tsx'
import { medium, phrase } from '../styles.ts'

const steps = [
  {
    title: '構想を聞く',
    body: '事業の目的と、いまある前提から話を始めます。技術で実現できるか、何から手をつけるか、どのくらいの規模になりそうかを、打ち合わせで一緒に考えます。',
  },
  {
    title: '最初に作るものを絞る',
    body: '市場の反応を確かめられる、いちばん小さな形を決めます。事業が伸びたときに作り直しが少なくて済む技術を選びます。',
  },
  {
    title: '自分で作り、一緒に見る',
    body: '設計から実装まで進めます。動くものを見ながら次に作るものを決め、必要なら社内の開発体制づくりまで手伝います。',
  },
]

export function ApproachSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <Section id="approach" name={t('進め方')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('話し合いから、')}</span>
          <span mix={phrase}>{t('最初の版が動くまで。')}</span>
        </h2>
        <p mix={sectionLede}>
          {t(
            '決める人と作る人が同じなので、話の往復が少なく、手戻りが出にくい進め方です。',
          )}
        </p>

        <ol
          // リストの見た目を消すと Safari の読み上げがリストとして扱わなくなるので、明示する
          role="list"
          mix={css({ marginTop: '40px', borderTop: '1px solid var(--border)' })}
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '8px',
                padding: '28px 0',
                borderBottom: '1px solid var(--border)',
                [medium]: {
                  gridTemplateColumns: '220px minmax(0, 1fr)',
                  gap: '32px',
                },
              })}
            >
              <h3 mix={css({ fontSize: 'var(--t-16)', lineHeight: 1.6 })}>
                {/* 順番は ol が伝えるので、見出しの名前には入れない */}
                <span
                  aria-hidden="true"
                  mix={css({
                    display: 'inline-block',
                    width: '2em',
                    color: 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums',
                  })}
                >
                  {index + 1}
                </span>
                {t(step.title)}
              </h3>
              <p mix={css({ color: 'var(--text-muted)' })}>{t(step.body)}</p>
            </li>
          ))}
        </ol>

        <p
          mix={css({
            marginTop: '24px',
            maxWidth: '36em',
            fontSize: 'var(--t-14)',
            color: 'var(--text-subtle)',
          })}
        >
          {t(
            '開発の責任者、取締役、経営企画室長として、技術と事業の両方を同じ席で話し合ってきました。その経験がこの進め方の土台です。',
          )}
        </p>

        <div
          mix={css({
            marginTop: '40px',
            maxWidth: '40em',
            padding: '20px 24px',
            borderRadius: 'var(--r-control)',
            boxShadow: 'inset 0 0 0 1px var(--border)',
          })}
        >
          <p
            mix={css({
              marginBottom: '6px',
              fontSize: 'var(--t-14)',
              fontWeight: 700,
            })}
          >
            {t('お受けしていないご依頼')}
          </p>
          <p mix={css({ fontSize: 'var(--t-14)', color: 'var(--text-muted)' })}>
            {t(
              '仕様が決まっていて開発だけを頼みたいご依頼、常駐や人月単位で人を出すご依頼はお受けしていません。作るものを一緒に決める進め方をとっているためです。',
            )}
          </p>
        </div>
      </Section>
    )
  }
}
