import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { paths } from '../../paths.ts'
import { ArrowUpRightIcon } from '../icons.tsx'
import { caption, externalLink, sm, textLink } from '../styles.ts'
import { PressList } from '../press-list.tsx'
import { Section, sectionHeading } from '../section.tsx'

const links = [
  { href: 'https://github.com/coji', label: 'GitHub' },
  { href: 'https://zenn.dev/coji', label: 'Zenn' },
  { href: 'https://x.com/techtalkjp', label: 'X' },
]

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
            '@media (min-width: 760px)': { gap: '32px' },
          })}
        >
          <img
            src="/images/coji.webp"
            width={112}
            height={112}
            loading="lazy"
            decoding="async"
            alt={t('溝口浩二の写真')}
            mix={css({
              width: '112px',
              height: '112px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 0 0 1px var(--border-strong)',
            })}
          />
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
            <div
              mix={css({
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: '24px',
                marginTop: '8px',
                fontSize: 'var(--t-14)',
              })}
            >
              <a
                href={paths.biography(locale)}
                mix={[textLink, css({ paddingBlock: '10px' })]}
              >
                {t('詳しい経歴')}
              </a>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                  mix={[textLink, externalLink]}
                >
                  {link.label}
                  <ArrowUpRightIcon size={12} />
                </a>
              ))}
            </div>
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
