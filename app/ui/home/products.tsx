import { css, type Handle, type RemixNode } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import {
  ArrowUpRightIcon,
  BotIcon,
  LinkIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from '../icons.tsx'
import { container, lg, md, mono, sm } from '../styles.ts'

const features: {
  icon: () => RemixNode
  title: string
  description: string
}[] = [
  {
    icon: () => <LinkIcon size={20} strokeWidth={1.75} />,
    title: 'すぐに共有できる',
    description:
      'HTML、Markdown、静的サイトを、閲覧用の安定したURLで共有できます。',
  },
  {
    icon: () => <RefreshIcon size={20} strokeWidth={1.75} />,
    title: '同じURLで更新できる',
    description:
      '成果物を更新しても共有先はそのまま。レビューと改善を継続できます。',
  },
  {
    icon: () => <BotIcon size={20} strokeWidth={1.75} />,
    title: 'AIエージェントから使える',
    description:
      'Web、CLI、MCPを通じて、人とAIエージェントのどちらからでも操作できます。',
  },
  {
    icon: () => <ShieldCheckIcon size={20} strokeWidth={1.75} />,
    title: '共有範囲を管理できる',
    description: '公開、ワークスペース、個別共有を用途に応じて選択できます。',
  },
]

/** 自社プロダクト（Artifact Share）の紹介。テーマに関わらず暗い配色 */
export function ProductsSection(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)

    return (
      <section
        id="products"
        mix={css({
          position: 'relative',
          borderTop: '1px solid var(--border)',
          background: '#020617',
          color: '#ffffff',
          paddingBlock: '6rem',
        })}
      >
        <div
          aria-hidden="true"
          mix={css({
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundImage:
              'radial-gradient(420px circle at 50% 0%, rgb(59 130 246 / 0.15), transparent 70%)',
          })}
        ></div>

        <div mix={[container, css({ position: 'relative' })]}>
          <div
            mix={[
              css({
                display: 'grid',
                gap: '3rem',
                [lg]: {
                  gridTemplateColumns: '1.05fr 0.95fr',
                  alignItems: 'end',
                },
              }),
            ]}
          >
            <div>
              <p
                mix={css({
                  marginBottom: '1.25rem',
                  fontFamily: mono,
                  fontSize: '0.875rem',
                  color: '#60a5fa',
                })}
              >
                {t('OUR PRODUCT')}
              </p>
              <div
                mix={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                })}
              >
                <div
                  mix={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '0.75rem',
                    background: '#ffffff',
                    color: '#020617',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    letterSpacing: '-0.05em',
                  })}
                >
                  AS
                </div>
                <h2
                  mix={css({
                    fontSize: '2.25rem',
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    [md]: { fontSize: '3rem' },
                  })}
                >
                  Artifact Share
                </h2>
              </div>
              <h3
                mix={css({
                  maxWidth: '42rem',
                  fontSize: '1.5rem',
                  lineHeight: 1.375,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  [md]: { fontSize: '1.875rem' },
                })}
              >
                {t('AIがつくった成果物を、チームや顧客へ届ける。')}
              </h3>
              <p
                mix={css({
                  marginTop: '1.5rem',
                  maxWidth: '42rem',
                  lineHeight: 1.625,
                  color: '#94a3b8',
                })}
              >
                {t(
                  'Artifact Shareは、AIエージェントや開発ツールで作ったレポート、ドキュメント、Webサイトを、共有・レビュー・継続更新するためのサービスです。株式会社TechTalkが企画・開発・運営しています。',
                )}
              </p>
              <a
                href="https://artifactshare.com"
                target="_blank"
                rel="noopener noreferrer"
                mix={css({
                  marginTop: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '0.25rem',
                  background: '#ffffff',
                  color: '#020617',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 700,
                  transition: 'background-color 150ms',
                  '&:hover': { background: '#dbeafe' },
                })}
              >
                {t('Artifact Shareを見る')}
                <ArrowUpRightIcon size={16} />
              </a>
            </div>

            <div
              mix={css({
                display: 'grid',
                gap: '1px',
                overflow: 'hidden',
                borderRadius: '1rem',
                border: '1px solid #1e293b',
                background: '#1e293b',
                [sm]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
              })}
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  mix={css({ background: '#0f172a', padding: '1.5rem' })}
                >
                  <div mix={css({ marginBottom: '1rem', color: '#60a5fa' })}>
                    {feature.icon()}
                  </div>
                  <h4
                    mix={css({
                      marginBottom: '0.5rem',
                      fontWeight: 700,
                      color: '#f1f5f9',
                    })}
                  >
                    {t(feature.title)}
                  </h4>
                  <p
                    mix={css({
                      fontSize: '0.875rem',
                      lineHeight: 1.625,
                      color: '#94a3b8',
                    })}
                  >
                    {t(feature.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
