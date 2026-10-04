import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { phrase } from '../styles.ts'
import { Section, sectionHeading, sectionLede } from './section.tsx'

/** 支援の内容と、それを裏付ける代表の経験 */
const services = [
  {
    title: 'MVPの開発と設計',
    description:
      '限られた人数と予算で、市場に出せる最初の形をつくります。技術選定から設計まで、事業の成長を見越して判断します。',
    basis: 'タクシーサイネージ事業を2名で立ち上げた経験から',
  },
  {
    title: 'データ基盤と分析',
    description:
      '事業の課題に直結するデータ基盤を、分析から可視化まで一貫してつくります。DuckDB、dbt、BigQueryを使います。',
    basis: '広告配信の入札アルゴリズムをデータアナリストとして改善した経験から',
  },
  {
    title: '生成AIの導入',
    description:
      '技術の動向と事業の価値の両面から、生成AIをどこに使うかを決め、プロダクトに組み込むところまで実装します。',
    basis:
      'Artifact Shareの開発で、AIエージェントとの連携を日々つくっている立場から',
  },
  {
    title: 'プロジェクトの推進と顧問',
    description:
      '開発のマネジメント、技術選定、マーケティングとの統合など、プロジェクトの要所で判断を支えます。',
    basis: 'フリークアウトでの事業開発と、IRISでの経営の経験から',
  },
]

const technologies = [
  'Remix',
  'React Router',
  'TypeScript',
  'Cloudflare Workers',
  'D1',
  'R2',
  'Kysely',
  'DuckDB',
  'MCP',
]

export function ServicesSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <Section id="services" name={t('技術支援')}>
        <h2 mix={sectionHeading}>
          <span mix={phrase}>{t('立ち上げ期の技術判断と実装を、')}</span>
          <span mix={phrase}>{t('事業をつくってきた当事者として')}</span>
          <span mix={phrase}>{t('引き受けます。')}</span>
        </h2>
        <p mix={sectionLede}>
          {t(
            '戦略を描くだけで終わらせず、動くシステムとして形にするところまで担います。代表が全案件に直接関わるため、判断の速さと実装の質を同時に保てます。',
          )}
        </p>

        <ul
          mix={css({ marginTop: '48px', borderTop: '1px solid var(--border)' })}
        >
          {services.map((service) => (
            <li
              key={service.title}
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '8px',
                padding: '28px 0',
                borderBottom: '1px solid var(--border)',
                '@media (min-width: 760px)': {
                  gridTemplateColumns: '220px minmax(0, 1fr)',
                  gap: '32px',
                },
              })}
            >
              <h3 mix={css({ fontSize: 'var(--t-16)', lineHeight: 1.6 })}>
                {t(service.title)}
              </h3>
              <div>
                <p mix={css({ color: 'var(--text-muted)' })}>
                  {t(service.description)}
                </p>
                <p
                  mix={css({
                    marginTop: '10px',
                    fontSize: 'var(--t-14)',
                    color: 'var(--text-subtle)',
                  })}
                >
                  {t(service.basis)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p
          mix={css({
            marginTop: '32px',
            fontSize: 'var(--t-14)',
            color: 'var(--text-subtle)',
          })}
        >
          <strong
            mix={css({
              marginRight: '8px',
              fontWeight: 700,
              color: 'var(--text-muted)',
            })}
          >
            {t('よく使う技術')}
          </strong>
          {technologies.join('・')}
        </p>
      </Section>
    )
  }
}
