import { css, type Handle } from 'remix/component'

import type { MessageKey } from '../../i18n/index.ts'
import { getI18n } from '../../i18n/provider.tsx'
import { paths } from '../../paths.ts'
import { ProfileLinks, ProfilePhoto } from '../profile-parts.tsx'
import { Section, sectionHeading } from '../section.tsx'
import { medium, textLink, wide } from '../styles.ts'

/** いま手がけている仕事。過去の肩書きは経歴ページに任せる */
const works: MessageKey[] = [
  '化学物質の検索システム',
  'AIを使った試作',
  'データの集計基盤',
  '自社プロダクト Artifact Share の開発・運営',
]

/** 代表の写真と、この仕事をしている理由、いま手がけている仕事 */
export function ProfileSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    return (
      <Section id="profile" name={t('代表')}>
        <div
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          })}
        >
          <ProfilePhoto alt={t('溝口浩二の写真')} lazy />
          <div>
            <h2 mix={sectionHeading}>{t('溝口 浩二')}</h2>
            <p
              mix={css({
                marginTop: '4px',
                fontSize: 'var(--t-14)',
                color: 'var(--text-subtle)',
              })}
            >
              {t('代表取締役 ／ Coji Mizoguchi')}
            </p>
          </div>
        </div>

        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '40px',
            marginTop: '40px',
            [wide]: {
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
              gap: '64px',
              marginTop: '48px',
            },
          })}
        >
          <div>
            <p mix={why}>
              {t(
                'がんばって作ったものが、事業として立ち上がらず無駄になる。そんな経験を何度もしてきました。良いものを作っただけでは、まだ足りません。事業として成り立ったとき、はじめて作った意味が生まれます。',
              )}
            </p>
            <p mix={why}>
              {t(
                'だから今は、作る前の段階から経営者と話し、事業になるかを一緒に見極めたうえで、自分の手で形にしています。',
              )}
            </p>
            <div mix={css({ marginTop: '12px' })}>
              <ProfileLinks>
                <a
                  href={paths.biography(locale)}
                  mix={[textLink, css({ paddingBlock: '10px' })]}
                >
                  {t('経歴を見る')}
                </a>
              </ProfileLinks>
            </div>
          </div>

          <div
            mix={css({
              alignSelf: 'start',
              padding: '24px',
              borderRadius: 'var(--r-image)',
              background: 'var(--surface)',
              boxShadow: 'inset 0 0 0 1px var(--border)',
              [medium]: { padding: '28px' },
            })}
          >
            <h3
              mix={css({
                fontSize: 'var(--t-14)',
                fontWeight: 700,
                color: 'var(--accent)',
              })}
            >
              {t('いま手がけている仕事')}
            </h3>
            <ul role="list" mix={css({ marginTop: '12px' })}>
              {works.map((work) => (
                <li
                  key={work}
                  mix={css({
                    paddingBlock: '10px',
                    lineHeight: 1.6,
                    '& + &': { borderTop: '1px solid var(--border)' },
                  })}
                >
                  {t(work)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    )
  }
}

const why = css({
  maxWidth: '34em',
  color: 'var(--text-muted)',
  '& + &': { marginTop: '16px' },
})
