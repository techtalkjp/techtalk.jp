import { clientEntry, css, type Handle } from 'remix/component'

import { navWide } from '../ui/styles.ts'

export interface SectionNavProps {
  label: string
  links: { href: string; label: string }[]
}

/**
 * ヘッダーのページ内ナビ。いま読んでいるセクションのリンクに aria-current="location" を付ける。
 * 別ページ（経歴など）ではトップの各セクションへのリンクとして働き、印は付かない
 */
export const SectionNav = clientEntry(
  '/js/entry.js#SectionNav',
  function SectionNav(handle: Handle<SectionNavProps>) {
    let current: string | undefined

    function update() {
      // 画面の上から 35% の線を越えた最後のセクションを、いま読んでいるものとする
      let line = window.innerHeight * 0.35
      let next: string | undefined
      for (let link of handle.props.links) {
        let hash = link.href.slice(link.href.indexOf('#'))
        let section = document.querySelector(hash)
        if (section && section.getBoundingClientRect().top <= line) {
          next = link.href
        }
      }
      if (next === current) return
      current = next
      void handle.update()
    }

    // スクロール位置（ブラウザ）と同期する。サーバー描画時は購読しない
    // （workerd では handle.signal を addEventListener に渡せない）
    if (typeof document !== 'undefined') {
      let ticking = false
      window.addEventListener(
        'scroll',
        () => {
          if (ticking) return
          ticking = true
          requestAnimationFrame(() => {
            ticking = false
            update()
          })
        },
        { passive: true, signal: handle.signal },
      )
      requestAnimationFrame(update)
    }

    return () => (
      <nav aria-label={handle.props.label} mix={navStyle}>
        {handle.props.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={link.href === current ? 'location' : undefined}
            mix={linkStyle}
          >
            {link.label}
          </a>
        ))}
      </nav>
    )
  },
)

const navStyle = css({
  display: 'flex',
  gap: '24px',
  order: 3,
  width: '100%',
  marginTop: '4px',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  fontSize: 'var(--t-14)',
  color: 'var(--text-muted)',
  [navWide]: { order: 0, width: 'auto', marginTop: 0, gap: '28px' },
})

const linkStyle = css({
  paddingBlock: '12px',
  whiteSpace: 'nowrap',
  transition: 'color 150ms ease-out',
  '&:hover': { color: 'var(--text-strong)' },
  '&[aria-current="location"]': {
    color: 'var(--text-strong)',
    textDecoration: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '8px',
  },
})
