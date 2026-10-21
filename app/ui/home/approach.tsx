import { css, type Handle } from 'remix/component'

import type { MessageKey } from '../../i18n/index.ts'
import { getI18n } from '../../i18n/provider.tsx'
import { Section, sectionHeading, sectionLede } from '../section.tsx'
import { phrase, wide } from '../styles.ts'

const steps: { title: MessageKey; body: MessageKey }[] = [
  {
    title: '誰に、何を届けるかを考える',
    body: '技術の種を使って、どんな顧客の何を解決し、どんな価値を届けられるかを一緒に考えます。',
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
    let { t } = getI18n(handle)
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

        {/* 原石（技術の種）を切り出して、光る完成品にするまでの 3 段を、下の 3 段に合わせて描いた生成画像。
            四辺はページの地の色に溶かしてある。飾りなので読み上げない */}
        <picture>
          <source
            srcset="/images/approach-dark.webp"
            media="(prefers-color-scheme: dark)"
          />
          <img
            src="/images/approach-light.webp"
            alt=""
            width={1600}
            height={560}
            loading="lazy"
            decoding="async"
            mix={css({
              width: '100%',
              marginTop: '32px',
              [wide]: { marginTop: '40px' },
            })}
          />
        </picture>

        <ol
          // リストの見た目を消すと Safari の読み上げがリストとして扱わなくなるので、明示する
          role="list"
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '40px',
            marginTop: '32px',
            [wide]: {
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '48px',
              marginTop: '16px',
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
