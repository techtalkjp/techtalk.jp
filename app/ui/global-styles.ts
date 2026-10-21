/**
 * サイト全体のベース CSS。デザイントークン（CSS 変数）とリセットだけを置き、
 * 個々の見た目は各コンポーネントの css() mixin（`rmx` レイヤー）で書く。
 *
 * 色は青みのある無彩色の階調（夜は黒、昼は白）にアクセント 1 色（明るい青）だけ。
 * 文字は 12 / 14 / 16 / 18 / 20 / 28 / 40 と見出しの display、余白は 8px 刻み、
 * 角丸はボタンのピル、入力欄 8px、画面や面 16px。
 * 入力欄の枠（--border-input）だけは、どこに書けばいいか見分けられるよう背景との差を 3:1 以上にする。
 * テーマは OS の設定（prefers-color-scheme）に従う。
 */
const lightTokens = `
  color-scheme: light;
  --bg: #ffffff;
  --surface: #f5f6f8;
  --border: #e5e7eb;
  --border-strong: #d0d4db;
  --border-input: #858c99;
  --text-strong: #0b0d12;
  --text-muted: #474e5c;
  --text-subtle: #626977;
  --accent: #2453d6;
  --accent-soft: #e7edfc;
  --button-bg: #0b0d12;
  --button-text: #ffffff;
  --danger: #b42318;
  --danger-surface: #fdecea;
  --shadow-image: 0 0 0 1px rgb(11 13 18 / 0.08), 0 32px 64px -32px rgb(11 13 18 / 0.28), 0 12px 24px -12px rgb(11 13 18 / 0.1);
`

const darkTokens = `
  color-scheme: dark;
  --bg: #0b0d12;
  --surface: #13161d;
  --border: #20242d;
  --border-strong: #2f3440;
  --border-input: #646b79;
  --text-strong: #f2f4f8;
  --text-muted: #b3bac7;
  --text-subtle: #8b93a2;
  --accent: #7fa2ff;
  --accent-soft: #172038;
  --button-bg: #f2f4f8;
  --button-text: #0b0d12;
  --danger: #ff9a8f;
  --danger-surface: #3a1c1b;
  --shadow-image: 0 0 0 1px rgb(255 255 255 / 0.1), 0 40px 80px -32px rgb(0 0 0 / 0.7);
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
    --t-40: clamp(1.5rem, 1rem + 2.4vw, 2.5rem);
    --t-display: clamp(2.25rem, 1rem + 5.4vw, 5.25rem);
    --r-control: 8px;
    --r-image: 16px;
    --r-pill: 999px;
    --header-height: 64px;
  }
  @media (prefers-color-scheme: dark) {
    :root { ${darkTokens} }
  }
  /* モバイルではヘッダーの 2 段目にナビを出す */
  @media (width <= 860px) {
    :root { --header-height: 108px; }
  }
  /* さらに狭いと、ボタンとナビが折り返して 3〜4 段になる（JS がない間の目安） */
  @media (width < 360px) {
    :root { --header-height: 190px; }
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
  html { scrollbar-color: var(--border-strong) var(--bg); caret-color: var(--accent); }
  img, svg { display: block; max-width: 100%; }
  img { height: auto; }
  a { color: inherit; text-decoration: inherit; }
  button, input, textarea { font: inherit; color: inherit; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(1.25rem); }
    to { opacity: 1; transform: none; }
  }
  @keyframes rise {
    from { transform: translateY(48px); }
    to { transform: none; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}
`
