import { css, type Handle, type RemixNode } from 'remix/component'

import { languageName, otherLocale } from '../i18n/index.ts'
import { getI18n } from '../i18n/provider.tsx'
import { ThemeMenu } from '../islands/theme-menu.tsx'
import { container, iconButton, md, mono } from './styles.ts'

/** ページの背景（グリッドと淡い光） */
export function Background() {
  return () => <div aria-hidden="true" mix={backgroundStyle} />
}

/** 「TT」のロゴマーク */
function TtBadge(
  handle: Handle<{ size?: 'sm' | 'md'; tone?: 'header' | 'footer' }>,
) {
  return () => {
    let small = handle.props.size === 'sm'
    let footer = handle.props.tone === 'footer'
    return (
      <span
        aria-hidden="true"
        mix={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: small ? '1.5rem' : '2rem',
          height: small ? '1.5rem' : '2rem',
          borderRadius: '0.125rem',
          background: footer ? 'var(--footer-badge-bg)' : 'var(--button-bg)',
          color: footer ? '#ffffff' : 'var(--button-text)',
          fontSize: small ? '0.75rem' : '0.875rem',
          fontWeight: 900,
          letterSpacing: 0,
        })}
      >
        TT
      </span>
    )
  }
}

/** 「TT」ロゴ付きのサイト名 */
export function Brand(
  handle: Handle<{ href: string; size?: 'sm' | 'md'; label?: string }>,
) {
  return () => {
    let { href, size = 'md', label = 'TechTalk' } = handle.props
    return (
      <a
        href={href}
        mix={css({
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: size === 'sm' ? '1rem' : '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.05em',
          color: 'var(--text-strong)',
        })}
      >
        <TtBadge size={size} />
        {label}
      </a>
    )
  }
}

/** テーマ切替メニュー。文言をサーバー側で翻訳して渡す */
export function ThemeSwitcher(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <ThemeMenu
        labels={{
          theme: t('テーマ'),
          light: t('ライト'),
          dark: t('ダーク'),
          system: t('システム'),
        }}
      />
    )
  }
}

/** もう一方の言語へのリンク。ページ全体を読み直して切り替える */
export function LanguageLink(handle: Handle<{ href: string }>) {
  return () => {
    let { locale } = getI18n(handle)
    return (
      <a
        href={handle.props.href}
        hrefLang={otherLocale(locale)}
        lang={otherLocale(locale)}
        data-rmx-document=""
        mix={iconButton}
      >
        {languageName(otherLocale(locale))}
      </a>
    )
  }
}

export function Footer(handle: Handle) {
  return () => {
    let { t } = getI18n(handle)
    return (
      <footer
        mix={css({
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid var(--border)',
          background: 'var(--bg)',
          paddingBlock: '3rem',
        })}
      >
        <div
          mix={[
            container,
            css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              [md]: { flexDirection: 'row' },
            }),
          ]}
        >
          <div
            mix={css({
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              color: 'var(--text-strong)',
            })}
          >
            <TtBadge size="sm" tone="footer" />
            {t('TechTalk Inc.')}
          </div>
          <div
            mix={css({
              fontFamily: mono,
              fontSize: '0.875rem',
              color: 'var(--text-subtle)',
            })}
          >
            {t('© TechTalk Inc. All Rights Reserved.')}
          </div>
        </div>
      </footer>
    )
  }
}

/** ページ全体の枠（背景、本文、フッター） */
export function PageShell(handle: Handle<{ children?: RemixNode }>) {
  return () => (
    <div mix={css({ position: 'relative', minHeight: '100vh' })}>
      <Background />
      {handle.props.children}
      <Footer />
    </div>
  )
}

/**
 * 背景はスクロールしない 1 枚のレイヤーに、グラデーションだけで描く。
 * 大きな blur や mask を固定レイヤーに使うと、iOS Safari ではスクロール中に
 * 本文の描画が追いつかず、背景だけが見える時間ができてしまう
 */
const backgroundStyle = css({
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  backgroundImage: [
    // 右上と左下の淡い光
    'radial-gradient(600px circle at calc(100% - 250px) 250px, var(--glow-blue), transparent 70%)',
    'radial-gradient(600px circle at 250px calc(100% - 250px), var(--glow-indigo), transparent 70%)',
    // 下に行くほどグリッドを背景色で消す
    'linear-gradient(to bottom, transparent 40%, var(--bg) 100%)',
    'linear-gradient(to right, var(--grid-line) 1px, transparent 1px)',
    'linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: 'auto, auto, auto, 40px 40px, 40px 40px',
})
