/**
 * サイト全体のベース CSS。デザイントークン（CSS 変数）とリセットだけを置き、
 * 個々の見た目は各コンポーネントの css() mixin（`rmx` レイヤー）で書く。
 *
 * 色は暖かみのある無彩色の階調にアクセント 1 色（Artifact Share の青）だけ。
 * 文字は 12 / 14 / 16 / 18 / 20 / 28 と見出しの display（18 はモバイルのリード文だけ）、余白は 8px 刻み、
 * 角丸は 6px（ボタン・入力）と 12px（画像）の 2 値。
 * テーマは OS の設定（prefers-color-scheme）に従う。
 */
const lightTokens = `
  color-scheme: light;
  --bg: #f8f6f2;
  --surface: #ffffff;
  --border: #e4e0d8;
  --border-strong: #cfcac0;
  --text-strong: #1c1b18;
  --text-muted: #4a4843;
  --text-subtle: #6c6962;
  --accent: #1d62ab;
  --accent-soft: #e6eef7;
  --button-bg: #1c1b18;
  --button-text: #f8f6f2;
  --danger: #b42318;
  --danger-surface: #fbeae8;
  --shadow-image: 0 0 0 1px rgb(28 27 24 / 0.07), 0 24px 48px -24px rgb(28 27 24 / 0.22), 0 8px 16px -8px rgb(28 27 24 / 0.08);
`

const darkTokens = `
  color-scheme: dark;
  --bg: #161513;
  --surface: #1e1d1a;
  --border: #2f2d29;
  --border-strong: #44413b;
  --text-strong: #f1eee8;
  --text-muted: #c4c0b7;
  --text-subtle: #8f8b83;
  --accent: #7fb0e6;
  --accent-soft: #1d2a38;
  --button-bg: #f1eee8;
  --button-text: #161513;
  --danger: #f2998f;
  --danger-surface: #3a1f1c;
  --shadow-image: 0 0 0 1px rgb(255 255 255 / 0.08), 0 24px 48px -24px rgb(0 0 0 / 0.6);
`

export const globalStyles = `
@layer base, rmx;

@layer base {
  :root {
    ${lightTokens}
    --t-12: 0.75rem;
    --t-14: 0.875rem;
    --t-16: 1rem;
    --t-18: 1.125rem;
    --t-20: 1.25rem;
    --t-28: 1.75rem;
    --t-display: clamp(1.875rem, 1rem + 4.6vw, 4.25rem);
    --r-control: 6px;
    --r-image: 12px;
    --header-height: 64px;
  }
  @media (prefers-color-scheme: dark) {
    :root { ${darkTokens} }
  }
  /* モバイルではヘッダーの 2 段目にナビを出す */
  @media (width <= 860px) {
    :root { --header-height: 108px; }
  }

  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  html {
    background: var(--bg);
    scroll-behavior: smooth;
    scroll-padding-top: calc(var(--header-height) + 8px);
    -webkit-text-size-adjust: 100%;
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
  body {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-strong);
    font-family: 'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif;
    font-size: var(--t-16);
    line-height: 1.7;
    letter-spacing: 0.01em;
    word-break: auto-phrase;
    line-break: strict;
    text-autospace: normal;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 { text-wrap: balance; }
  p, li, dd { text-wrap: pretty; }
  ul, ol { padding: 0; list-style: none; }
  ::selection { background: var(--accent); color: var(--bg); }
  img, svg { display: block; max-width: 100%; }
  img { height: auto; }
  a { color: inherit; text-decoration: inherit; }
  button, input, textarea { font: inherit; color: inherit; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(1.25rem); }
    to { opacity: 1; transform: none; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}
`
