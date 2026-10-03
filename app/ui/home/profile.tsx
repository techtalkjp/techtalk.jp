import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { paths } from '../../paths.ts'
import { BookOpenIcon, FacebookIcon, GithubIcon, UserIcon } from '../icons.tsx'
import { container, md, mono, panel, reveal } from '../styles.ts'

const socialLink = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
  color: 'var(--text-muted)',
  transition: 'color 150ms',
  '&:hover': { color: 'var(--text-strong)' },
})

export function ProfileSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)

    return (
      <section
        id="profile"
        mix={[container, reveal, css({ paddingBlock: '6rem' })]}
      >
        <div mix={[panel, css({ padding: '2rem', [md]: { padding: '4rem' } })]}>
          <div
            mix={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '3rem',
              [md]: { flexDirection: 'row' },
            })}
          >
            <div
              mix={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                width: '100%',
                [md]: { width: '33.333%' },
              })}
            >
              <div>
                <p
                  mix={css({
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                  })}
                >
                  {t('代表取締役')}
                </p>
                <h3
                  mix={css({
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-strong)',
                  })}
                >
                  {t('溝口 浩二')}
                </h3>
                <p
                  mix={css({
                    marginTop: '0.25rem',
                    fontFamily: mono,
                    fontSize: '0.875rem',
                    color: 'var(--text-subtle)',
                  })}
                >
                  {t('Coji Mizoguchi')}
                </p>
              </div>
              <div
                mix={css({ display: 'flex', flexWrap: 'wrap', gap: '1rem' })}
              >
                <a
                  href="https://zenn.dev/coji"
                  target="_blank"
                  rel="noopener noreferrer"
                  mix={socialLink}
                >
                  <BookOpenIcon size={16} /> Zenn
                </a>
                <a
                  href="https://github.com/coji"
                  target="_blank"
                  rel="noopener noreferrer"
                  mix={socialLink}
                >
                  <GithubIcon size={16} /> GitHub
                </a>
                <a
                  href="https://www.facebook.com/mizoguchi.coji"
                  target="_blank"
                  rel="noopener noreferrer"
                  mix={socialLink}
                >
                  <FacebookIcon size={16} /> Facebook
                </a>
              </div>
              <a
                href={paths.biography(locale)}
                mix={css({
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface-muted)',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-strong)',
                  transition: 'border-color 150ms, background-color 150ms',
                  '&:hover': { borderColor: 'var(--text-faint)' },
                })}
              >
                <UserIcon size={16} />
                {t('詳しい略歴を見る')}
              </a>
            </div>

            <div
              mix={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                width: '100%',
                lineHeight: 1.625,
                color: 'var(--text-body)',
                [md]: { width: '66.666%' },
              })}
            >
              <p>
                {t(
                  '1999年、ドワンゴでエンジニアとしてキャリアをスタート。ニコニコ動画の成長期を技術面から支えた後、フリークアウトでは事業開発とデータ分析の両面を経験。',
                )}
              </p>
              <p>
                {t(
                  '2016年、タクシーサイネージ事業IRISを2名で立ち上げ、代表取締役副社長として経営と実装を統括。2019年にTechTalkを設立し、現在も自らコードを書き続けています。',
                )}
              </p>
              <p>
                {t(
                  '経営判断と技術実装の両方に責任を持ち、事業の立ち上げ期や重要な技術判断が必要な局面で、判断の速度と実装の質を提供します。',
                )}
              </p>
              <div
                mix={css({
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-inset)',
                  padding: '1.5rem',
                })}
              >
                <h4
                  mix={css({
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--text-strong)',
                  })}
                >
                  {t('ひとり法人の強み')}
                </h4>
                <p
                  mix={css({
                    fontSize: '0.875rem',
                    lineHeight: 1.625,
                    color: 'var(--text-muted)',
                  })}
                >
                  {t(
                    '大規模な開発体制ではなく、代表が全案件に直接関わることで、ビジネス理解と技術実装を一体化。戦略立案から実装まで、意思決定の速度を保ちながら価値を届けます。',
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
