import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { paths } from '../../paths.ts'
import { ArrowUpRightIcon } from '../icons.tsx'
import { caption, sm, textLink } from '../styles.ts'
import { externalLink } from './products.tsx'
import { Section, sectionHeading } from './section.tsx'

const links = [
  { href: 'https://github.com/coji', label: 'GitHub' },
  { href: 'https://zenn.dev/coji', label: 'Zenn' },
  { href: 'https://x.com/techtalkjp', label: 'X' },
]

const press = [
  {
    href: 'https://forbesjapan.com/articles/detail/22941',
    publisher: 'Forbes JAPAN',
    title: '合弁会社で世界へ タクシーメディアの掲げる野望',
  },
  {
    href: 'https://thebridge.jp/2014/06/takanori-oshiba-interview-series-vol-7',
    publisher: 'THE BRIDGE',
    title:
      '「本田の描く広告の未来を実現する」フリークアウト 溝口氏インタビュー',
  },
  {
    href: 'https://japan.cnet.com/article/20361283/',
    publisher: 'CNET Japan',
    title: 'ニワンゴ技術責任者が語る、「ニコニコ動画」成功の鍵',
  },
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
          {press.map((article) => (
            <a
              key={article.href}
              href={article.href}
              target="_blank"
              rel="noopener"
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '2px',
                padding: '16px 0',
                borderBottom: '1px solid var(--border)',
                '&:hover .title': { color: 'var(--accent)' },
                [sm]: {
                  gridTemplateColumns: '160px minmax(0, 1fr) auto',
                  gap: '24px',
                  alignItems: 'baseline',
                },
              })}
            >
              <span
                mix={css({
                  fontSize: 'var(--t-14)',
                  color: 'var(--text-subtle)',
                })}
              >
                {article.publisher}
              </span>
              {/* 記事の題名は原題のまま載せる */}
              <span
                class="title"
                lang="ja"
                mix={css({ transition: 'color 150ms ease-out' })}
              >
                {article.title}
              </span>
              <span
                mix={css({
                  display: 'none',
                  color: 'var(--text-subtle)',
                  [sm]: { display: 'block' },
                })}
              >
                <ArrowUpRightIcon size={13} />
              </span>
            </a>
          ))}
        </div>
      </Section>
    )
  }
}
