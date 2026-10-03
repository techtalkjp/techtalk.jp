import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { md, narrowContainer, panel, reveal } from '../styles.ts'

const rows: [label: string, value: string][] = [
  ['会社名', '株式会社TechTalk'],
  ['代表取締役', '溝口 浩二'],
  ['設立', '2019年7月'],
  ['所在地', '〒104-0051 東京都中央区佃2-1-2'],
  [
    '事業内容',
    '自社プロダクトの開発・運営、ソフトウェア開発、技術コンサルティング',
  ],
]

export function CompanySection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)

    return (
      <section
        id="company"
        mix={[
          reveal,
          css({ borderTop: '1px solid var(--border)', paddingBlock: '6rem' }),
        ]}
      >
        <div mix={narrowContainer}>
          <h2
            mix={css({
              marginBottom: '3rem',
              textAlign: 'center',
              fontSize: '1.875rem',
              fontWeight: 700,
              color: 'var(--text-strong)',
            })}
          >
            {t('会社概要')}
          </h2>

          <div
            mix={[
              panel,
              css({
                maxWidth: '42rem',
                marginInline: 'auto',
                padding: '2rem',
                [md]: { padding: '3rem' },
              }),
            ]}
          >
            <dl
              mix={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              })}
            >
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  mix={css({
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '1.5rem',
                    '&:last-child': { borderBottom: 'none', paddingBottom: 0 },
                  })}
                >
                  <dt
                    mix={css({
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                    })}
                  >
                    {t(label)}
                  </dt>
                  <dd
                    mix={css({
                      margin: 0,
                      fontSize: '1.125rem',
                      lineHeight: 1.625,
                      fontWeight: 500,
                      color: 'var(--text-strong)',
                    })}
                  >
                    {t(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    )
  }
}
