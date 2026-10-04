import { clientEntry, css, ref, type Handle } from 'remix/component'

import { navWide } from '../ui/styles.ts'

export interface SectionNavProps {
  label: string
  links: { href: string; label: string }[]
  /**
   * いま読んでいる場所の判定に使う、ナビにはないセクション（#contact など）。
   * そこを読んでいる間はどのリンクにも印を付けない
   */
  extraSections?: string[]
}

/**
 * ヘッダーのページ内ナビ。いま読んでいるセクションのリンクに aria-current="location" を付ける。
 * 別ページ（経歴など）ではトップの各セクションへのリンクとして働き、印は付かない。
 * あわせて、ヘッダーの実際の高さを --header-height に入れ、アンカーで飛んだ先の見出しが隠れないようにする
 */
export const SectionNav = clientEntry(
  '/js/entry.js#SectionNav',
  function SectionNav(handle: Handle<SectionNavProps>) {
    let current: string | undefined
    let sections: { href: string | undefined; element: Element }[] = []
    let sectionsFor: SectionNavProps['links'] | undefined

    function findSections() {
      let { links, extraSections = [] } = handle.props
      let targets = [
        ...links.map((link) => ({ href: link.href, hash: hashOf(link.href) })),
        ...extraSections.map((hash) => ({ href: undefined, hash })),
      ]
      return targets.flatMap(({ href, hash }) => {
        let element = hash ? document.querySelector(hash) : null
        return element ? [{ href, element }] : []
      })
    }

    function update() {
      // ページを移動すると props が変わり、前のページの要素は DOM から外れるので探し直す
      if (
        sectionsFor !== handle.props.links ||
        sections.some(({ element }) => !element.isConnected)
      ) {
        sections = findSections()
        sectionsFor = handle.props.links
      }
      // 画面の上から 35% の線を越えた、いちばん下のセクションを、いま読んでいるものとする
      let line = window.innerHeight * 0.35
      let next: { href: string | undefined; top: number } | undefined
      for (let { href, element } of sections) {
        let top = element.getBoundingClientRect().top
        if (top <= line && (!next || top > next.top)) next = { href, top }
      }
      if (next?.href === current) return
      current = next?.href
      void handle.update()
    }

    // スクロール位置と画面の大きさ（ブラウザ）に合わせて印を付け直す。
    // サーバー描画時は購読しない（workerd では handle.signal を addEventListener に渡せない）
    if (typeof document !== 'undefined') {
      let ticking = false
      let schedule = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(() => {
          ticking = false
          update()
        })
      }
      window.addEventListener('scroll', schedule, {
        passive: true,
        signal: handle.signal,
      })
      window.addEventListener('resize', schedule, { signal: handle.signal })
      schedule()
    }

    // ヘッダーの高さ（DOM のレイアウト）を CSS 変数に写す
    let measureHeader = ref((node, signal) => {
      let header = node.closest('header')
      if (!header) return
      let root = document.documentElement
      let observer = new ResizeObserver(() => {
        root.style.setProperty('--header-height', `${header.offsetHeight}px`)
      })
      observer.observe(header)
      signal.addEventListener('abort', () => {
        observer.disconnect()
        root.style.removeProperty('--header-height')
      })
    })

    return () => (
      <nav aria-label={handle.props.label} mix={[navStyle, measureHeader]}>
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

function hashOf(href: string): string | undefined {
  let index = href.indexOf('#')
  return index === -1 ? undefined : href.slice(index)
}

const navStyle = css({
  display: 'flex',
  // 横スクロールにすると、はみ出したリンクがあることに気づけない。狭い幅では折り返す
  flexWrap: 'wrap',
  columnGap: '16px',
  order: 3,
  width: '100%',
  marginTop: '4px',
  fontSize: 'var(--t-14)',
  color: 'var(--text-muted)',
  [navWide]: {
    order: 0,
    width: 'auto',
    flexWrap: 'nowrap',
    marginTop: 0,
    columnGap: '28px',
  },
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
