import { css, type Handle, type RemixNode } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import {
  CompassIcon,
  DatabaseZapIcon,
  DiscIcon,
  ExternalLinkIcon,
  LayersIcon,
  SparklesIcon,
} from '../icons.tsx'
import { container, eyebrow, md, mono, sectionTitle } from '../styles.ts'

interface Service {
  /** アクセント色（CSS 変数）と、アイコン背景のグラデーション用 RGB */
  accent: string
  tint: string
  icon: () => RemixNode
  title: string
  description: string
  items: [string, string, string]
}

const services: Service[] = [
  {
    accent: 'var(--accent)',
    tint: '59 130 246',
    icon: () => <LayersIcon size={28} strokeWidth={1.5} />,
    title: 'MVP Development & Architecture',
    description:
      'タクシーサイネージ事業を2名体制で立ち上げた経験から、限られたリソースで事業を形にする実装力を提供します。技術選定からアーキテクチャ設計まで、事業の成長を見据えた判断で市場投入を支援します。',
    items: [
      '成長を見据えた技術選定',
      '最小限のコストで市場検証',
      '事業フェーズに応じた設計判断',
    ],
  },
  {
    accent: 'var(--accent-indigo)',
    tint: '99 102 241',
    icon: () => <DatabaseZapIcon size={28} strokeWidth={1.5} />,
    title: 'Data Infrastructure & Analytics',
    description:
      'DSPの入札アルゴリズム改善にデータアナリストとして携わった経験から、ビジネス課題を解決するデータ基盤を構築します。DuckDB、dbt、BigQueryを用いて、意思決定を支えるデータ活用を実装します。',
    items: [
      'ビジネス課題に直結するデータ設計',
      '分析から可視化まで一貫構築',
      '機械学習モデルの実装支援',
    ],
  },
  {
    accent: 'var(--accent-purple)',
    tint: '168 85 247',
    icon: () => <SparklesIcon size={28} strokeWidth={1.5} />,
    title: 'AI Integration & Strategy',
    description:
      '技術トレンドと事業価値の両面から、生成AIの実装判断を行います。Vercel AI SDKなどの最新技術を使い、実際に動く形でAIの価値を実証。戦略立案から実装まで一貫して提供します。',
    items: [
      'ROIを意識したAI活用戦略',
      'プロダクトへのAI統合実装',
      'プロンプトエンジニアリング',
    ],
  },
  {
    accent: 'var(--accent-emerald)',
    tint: '16 185 129',
    icon: () => <CompassIcon size={28} strokeWidth={1.5} />,
    title: 'Project Leadership & Advisory',
    description:
      'フリークアウトでの事業開発、IRISでの経営経験から、技術とビジネスの両面を理解した判断を提供します。開発マネジメント、技術選定、マーケティング統合など、プロジェクトの重要な局面を支援します。',
    items: [
      '経営視点での技術判断',
      '少数精鋭チームのマネジメント',
      '事業KPIを意識した開発推進',
    ],
  },
]

const technologies = [
  'React Router',
  'TypeScript',
  'Cloudflare',
  'Cloudflare D1 / R2',
  'Kysely',
  'DuckDB',
  'MCP / Agent CLI',
]

const card = css({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '1rem',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  padding: '2rem',
  transition: 'border-color 300ms, background-color 300ms',
  '&:hover': {
    borderColor: 'color-mix(in srgb, var(--card-accent) 40%, transparent)',
    background: 'var(--surface-hover)',
  },
  '&:hover h4': { color: 'var(--card-accent)' },
})

function IconBadge(
  handle: Handle<{ tint: string; accent: string; children?: RemixNode }>,
) {
  return () => (
    <div
      mix={css({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '0.75rem',
        border: `1px solid rgb(${handle.props.tint} / 0.2)`,
        backgroundImage: `linear-gradient(to bottom right, rgb(${handle.props.tint} / 0.2), transparent)`,
        color: handle.props.accent,
        boxShadow: `0 0 20px rgb(${handle.props.tint} / 0.25)`,
      })}
    >
      {handle.props.children}
    </div>
  )
}

export function ServicesSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)

    return (
      <section
        id="services"
        mix={css({
          position: 'relative',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg)',
          paddingBlock: '6rem',
        })}
      >
        <div mix={container}>
          <div mix={css({ marginBottom: '4rem' })}>
            <p mix={[eyebrow, css({ marginBottom: '0.5rem' })]}>
              {t('OUR SERVICES')}
            </p>
            <h2 mix={sectionTitle}>{t('4つのサービス領域')}</h2>
          </div>

          <div
            mix={css({
              display: 'grid',
              gap: '2rem',
              [md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
            })}
          >
            {services.map((service) => (
              <div
                key={service.title}
                style={{ '--card-accent': service.accent }}
                mix={card}
              >
                <div mix={css({ marginBottom: '1.5rem' })}>
                  <IconBadge tint={service.tint} accent={service.accent}>
                    {service.icon()}
                  </IconBadge>
                </div>
                <h4
                  mix={css({
                    marginBottom: '0.75rem',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-strong)',
                    transition: 'color 150ms',
                  })}
                >
                  {t(service.title)}
                </h4>
                <p
                  mix={css({
                    flexGrow: 1,
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.625,
                    color: 'var(--text-muted)',
                  })}
                >
                  {t(service.description)}
                </p>
                <ul
                  mix={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    padding: 0,
                    paddingTop: '1rem',
                    listStyle: 'none',
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.875rem',
                    color: 'var(--text-body)',
                  })}
                >
                  {service.items.map((item) => (
                    <li
                      key={item}
                      mix={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      })}
                    >
                      <span
                        mix={css({
                          width: '0.25rem',
                          height: '0.25rem',
                          borderRadius: '9999px',
                          background: `rgb(${service.tint})`,
                        })}
                      />
                      {t(item)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            mix={[
              css({
                marginTop: '5rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '3rem',
              }),
            ]}
          >
            <p
              mix={css({
                marginBottom: '2rem',
                textAlign: 'center',
                fontFamily: mono,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: 'var(--text-faint)',
              })}
            >
              {t('CORE TECHNOLOGIES')}
            </p>
            <div
              mix={css({
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                columnGap: '2.5rem',
                rowGap: '1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                [md]: { fontSize: '1rem' },
              })}
            >
              {technologies.map((name) => (
                <span
                  key={name}
                  mix={css({
                    transition: 'color 150ms',
                    '&:hover': { color: 'var(--text-strong)' },
                  })}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <RecordsBanner />
        </div>
      </section>
    )
  }
}

function RecordsBanner(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    let tint = '244 63 94'

    return (
      <a
        href="https://records.techtalk.jp"
        target="_blank"
        rel="noopener noreferrer"
        style={{ '--card-accent': 'var(--accent-rose)' }}
        mix={[
          card,
          css({
            marginTop: '3rem',
            alignItems: 'center',
            gap: '1.5rem',
            [md]: { flexDirection: 'row', padding: '2.5rem' },
          }),
        ]}
      >
        <div
          mix={css({
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            gap: '1rem',
          })}
        >
          <IconBadge tint={tint} accent="var(--accent-rose)">
            <span
              mix={css({
                display: 'block',
                transition: 'transform 500ms',
                'a:hover &': { transform: 'rotate(180deg)' },
              })}
            >
              <DiscIcon size={28} strokeWidth={1.5} />
            </span>
          </IconBadge>
          <div>
            <p
              mix={css({
                fontFamily: mono,
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: 'var(--text-faint)',
              })}
            >
              {t('MUSIC LABEL')}
            </p>
            <h4
              mix={css({
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-strong)',
                transition: 'color 150ms',
              })}
            >
              TechTalk Records
            </h4>
          </div>
        </div>

        <p
          mix={css({
            flexGrow: 1,
            fontSize: '0.875rem',
            lineHeight: 1.625,
            color: 'var(--text-muted)',
          })}
        >
          {t(
            'AIエージェントの世界観を音楽で表現するインディペンデントレーベル。架空のラッパー Claude Code と Codex が、dissやコラボを通じてターミナルカルチャーを描きます。',
          )}
        </p>

        <span
          mix={css({
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: mono,
            fontSize: '0.875rem',
            color: 'var(--accent-rose)',
          })}
        >
          records.techtalk.jp
          <ExternalLinkIcon size={16} />
        </span>
      </a>
    )
  }
}
