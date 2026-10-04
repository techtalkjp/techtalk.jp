import { css } from 'remix/component'

export const sm = '@media (min-width: 640px)'
export const md = '@media (min-width: 768px)'
/** セクションを左右 2 カラムにする幅 */
export const wide = '@media (min-width: 900px)'
/** ヘッダーのナビを 1 段に収める幅 */
export const navWide = '@media (min-width: 861px)'

/** 横幅 1120px（左右 24px の余白込み）のコンテナ */
export const container = css({
  maxWidth: '70rem',
  marginInline: 'auto',
  paddingInline: '1.5rem',
})

/** 文章を読ませるページ用の、横幅 48rem のコンテナ */
export const narrowContainer = css({
  maxWidth: '48rem',
  marginInline: 'auto',
  paddingInline: '1.5rem',
})

/** ページ表示時に一度だけふわっと出す */
export const fadeUpOnLoad = css({
  '@media (prefers-reduced-motion: no-preference)': {
    animation: 'fade-up 0.6s ease-out both',
  },
})

/**
 * 見出しの文節。日本語では途中で折り返さない。
 * 英語は普通に折り返す（inline-block だと訳文の末尾の空白が消えて語がくっつく）
 */
export const phrase = css({ '&:lang(ja)': { display: 'inline-block' } })

const buttonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  height: '40px',
  paddingInline: '18px',
  border: 0,
  borderRadius: 'var(--r-control)',
  fontSize: 'var(--t-14)',
  fontWeight: 700,
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'background-color 150ms ease-out, transform 150ms ease-out',
  '&:active': { transform: 'scale(0.97)' },
} as const

/** 塗りのボタン。1 画面に 1 つだけ置く */
export const primaryButton = css({
  ...buttonBase,
  background: 'var(--button-bg)',
  color: 'var(--button-text)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.12)',
  '&:hover': {
    background: 'color-mix(in srgb, var(--button-bg) 86%, var(--bg))',
  },
  '&:disabled': { opacity: 0.6, cursor: 'progress' },
})

/** 枠線だけのボタン */
export const secondaryButton = css({
  ...buttonBase,
  background: 'transparent',
  color: 'var(--text-strong)',
  boxShadow: 'inset 0 0 0 1px var(--border-strong)',
  '&:hover': { background: 'var(--surface)' },
})

/** 本文中のリンク */
export const textLink = css({
  color: 'var(--accent)',
  textDecoration: 'underline',
  textDecorationThickness: '1px',
  textUnderlineOffset: '4px',
  textDecorationColor: 'color-mix(in srgb, var(--accent) 40%, transparent)',
  transition: 'text-decoration-color 150ms ease-out',
  '&:hover': { textDecorationColor: 'var(--accent)' },
})

/** 小さな補足ラベル（「代表 溝口浩二の経歴」「掲載記事」など） */
export const caption = css({
  fontSize: 'var(--t-12)',
  color: 'var(--text-subtle)',
  letterSpacing: '0.04em',
})
