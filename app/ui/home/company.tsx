import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { sm } from '../styles.ts'
import { Section } from '../section.tsx'

const rows: [label: string, value: string][] = [
  ['会社名', '株式会社TechTalk'],
  ['代表取締役', '溝口 浩二'],
  ['設立', '2019年7月'],
  ['所在地', '東京都中央区'],
  [
    '事業内容',
    '新規事業の立ち上げと技術面の相談、ソフトウェア開発、自社プロダクトArtifact Shareの開発・運営',
  ],
]

export function CompanySection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <Section id="company" name={t('会社概要')} nameIsHeading>
        <dl>
          {rows.map(([label, value]) => (
            <div
              key={label}
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '2px',
                padding: '18px 0',
                borderBottom: '1px solid var(--border)',
                '&:first-child': { paddingTop: 0 },
                [sm]: {
                  gridTemplateColumns: '160px minmax(0, 1fr)',
                  alignItems: 'baseline',
                  gap: '24px',
                },
              })}
            >
              <dt
                mix={css({
                  fontSize: 'var(--t-14)',
                  color: 'var(--text-subtle)',
                })}
              >
                {t(label)}
              </dt>
              <dd mix={css({ margin: 0 })}>{t(value)}</dd>
            </div>
          ))}
        </dl>
      </Section>
    )
  }
}
