import { css, type Handle, type RemixNode } from 'remix/component'

import { PROFILE_URLS } from '../config.ts'
import { ArrowUpRightIcon } from './icons.tsx'
import { externalLink, textLink } from './styles.ts'

const socialLinks = [
  { href: PROFILE_URLS.github, label: 'GitHub' },
  { href: PROFILE_URLS.zenn, label: 'Zenn' },
  { href: PROFILE_URLS.x, label: 'X' },
  { href: PROFILE_URLS.facebook, label: 'Facebook' },
]

/** 代表の丸い写真 */
export function ProfilePhoto(handle: Handle<{ alt: string; lazy?: boolean }>) {
  return () => (
    <img
      src="/images/coji.webp"
      width={112}
      height={112}
      loading={handle.props.lazy ? 'lazy' : undefined}
      decoding="async"
      alt={handle.props.alt}
      mix={css({
        width: '112px',
        height: '112px',
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 0 0 1px var(--border-strong)',
      })}
    />
  )
}

/** 代表の外部リンク（GitHub など）。先頭にサイト内のリンクを足せる */
export function ProfileLinks(handle: Handle<{ children?: RemixNode }>) {
  return () => (
    <div
      mix={css({
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '24px',
        fontSize: 'var(--t-14)',
      })}
    >
      {handle.props.children}
      {socialLinks.map((link) => (
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
  )
}
