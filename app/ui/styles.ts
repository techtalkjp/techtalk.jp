import { css } from 'remix/component'

export const md = '@media (min-width: 768px)'
export const lg = '@media (min-width: 1024px)'
export const sm = '@media (min-width: 640px)'

export const mono =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"

/** 横幅 72rem のコンテナ */
export const container = css({
  maxWidth: '72rem',
  marginInline: 'auto',
  paddingInline: '1.5rem',
})

/** 横幅 56rem のコンテナ */
export const narrowContainer = css({
  maxWidth: '56rem',
  marginInline: 'auto',
  paddingInline: '1.5rem',
})

/**
 * スクロールに合わせてふわっと表示する（CSS の scroll-driven animations）。
 * 未対応ブラウザや「視差効果を減らす」設定ではそのまま表示する。
 */
export const reveal = css({
  '@supports (animation-timeline: view())': {
    '@media (prefers-reduced-motion: no-preference)': {
      animation: 'reveal linear both',
      animationTimeline: 'view()',
      animationRange: 'entry 0% entry 35%',
    },
  },
})

/** ページ表示時に一度だけふわっと出す */
export const fadeUpOnLoad = css({
  '@media (prefers-reduced-motion: no-preference)': {
    animation: 'fade-up 1s ease-out both',
  },
})

/** セクション上部の小さな英字ラベル */
export const eyebrow = css({
  fontFamily: mono,
  fontSize: '0.875rem',
  color: 'var(--accent)',
})

export const sectionTitle = css({
  fontSize: '1.875rem',
  lineHeight: 1.2,
  fontWeight: 700,
  color: 'var(--text-strong)',
  [md]: { fontSize: '2.25rem' },
})

/** 角丸の枠付きパネル */
export const panel = css({
  borderRadius: '1.5rem',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  backdropFilter: 'blur(4px)',
})

export const primaryButton = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  borderRadius: '0.25rem',
  border: 'none',
  background: 'var(--button-bg)',
  color: 'var(--button-text)',
  padding: '1rem 2rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'background-color 150ms, transform 150ms',
  '&:hover': { background: 'var(--button-bg-hover)' },
  '&:active': { transform: 'scale(0.95)' },
  '&:disabled': { opacity: 0.6, cursor: 'progress' },
})

export const secondaryButton = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  borderRadius: '0.25rem',
  border: '1px solid var(--border-strong)',
  background: 'transparent',
  color: 'var(--text-strong)',
  padding: '1rem 2rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 150ms',
  '&:hover': { background: 'var(--surface-muted)' },
})

/** ヘッダーなどの小さな四角いアイコンボタン */
export const iconButton = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.375rem',
  minWidth: '2.25rem',
  height: '2.25rem',
  paddingInline: '0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--border-strong)',
  background: 'transparent',
  color: 'var(--text-strong)',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 150ms',
  '&:hover': { background: 'var(--surface-muted)' },
})

export const visuallyHidden = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})
