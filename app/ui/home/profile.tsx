import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { paths } from '../../paths.ts'
import { ProfileLinks, ProfilePhoto } from '../profile-parts.tsx'
import { Section, sectionHeading } from '../section.tsx'
import { medium, textLink } from '../styles.ts'

/** 代表の写真と、この仕事をしている理由。経歴の詳細は経歴ページに任せる */
export function ProfileSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    let why = css({
      marginTop: '16px',
      maxWidth: '34em',
      color: 'var(--text-muted)',
    })
    return (
      <Section id="profile" name={t('代表')}>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '24px',
            [medium]: {
              gridTemplateColumns: '112px minmax(0, 1fr)',
              gap: '32px',
            },
          })}
        >
          <ProfilePhoto alt={t('溝口浩二の写真')} lazy />
          {/* 左のセクション名とこの見出しのベースラインがそろうよう、ここをベースラインの基準にする */}
          <div mix={css({ alignSelf: 'baseline' })}>
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
            <p mix={why}>
              {t(
                'がんばって作ったものが、事業として立ち上がらず無駄になる。そんな経験を何度もしてきました。良いものを作っただけでは、まだ足りません。ビジネスとして成り立ったとき、はじめて作った意味が生まれます。',
              )}
            </p>
            <p mix={[why, css({ marginTop: '12px' })]}>
              {t(
                'だから今は、作る前の段階から経営者と話し、事業になるかを一緒に見極めたうえで、自分の手で形にしています。',
              )}
            </p>
            <div mix={css({ marginTop: '8px' })}>
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
        </div>
      </Section>
    )
  }
}
