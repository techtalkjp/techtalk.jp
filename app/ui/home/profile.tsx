import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { paths } from '../../paths.ts'
import { PressList } from '../press-list.tsx'
import { ProfileLinks, ProfilePhoto } from '../profile-parts.tsx'
import { Section, sectionHeading } from '../section.tsx'
import { caption, medium, textLink } from '../styles.ts'

/** 経歴は冒頭の年表で見せているので、ここは写真・肩書・リンク・掲載記事だけにする */
export function ProfileSection(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    return (
      <Section id="profile" name={t('代表')}>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: '112px minmax(0, 1fr)',
            alignItems: 'center',
            gap: '24px',
            [medium]: { gap: '32px' },
          })}
        >
          <ProfilePhoto alt={t('溝口浩二の写真')} lazy />
          {/* 左のセクション名とこの見出しのベースラインがそろうよう、ここをベースラインの基準にする */}
          <div mix={css({ alignSelf: 'baseline' })}>
            <h2 mix={sectionHeading}>{t('溝口 浩二')}</h2>
            <p
              mix={css({
                marginTop: '4px',
                marginBottom: '8px',
                fontSize: 'var(--t-14)',
                color: 'var(--text-subtle)',
              })}
            >
              {t('代表取締役 ／ Coji Mizoguchi')}
            </p>
            <ProfileLinks>
              <a
                href={paths.biography(locale)}
                mix={[textLink, css({ paddingBlock: '10px' })]}
              >
                {t('詳しい経歴')}
              </a>
            </ProfileLinks>
          </div>
        </div>

        <div
          mix={css({ marginTop: '56px', borderTop: '1px solid var(--border)' })}
        >
          <p mix={[caption, css({ padding: '20px 0 4px' })]}>{t('掲載記事')}</p>
          <PressList />
        </div>
      </Section>
    )
  }
}
