/**
 * サイト全体のベース CSS。デザイントークン（CSS 変数）とリセットだけを置き、
 * 個々の見た目は各コンポーネントの css() mixin（`rmx` レイヤー）で書く。
 *
 * テーマ: 何も選ばれていなければ OS 設定（prefers-color-scheme）に従う。
 * ライト/ダークを明示的に選ぶと、描画前のスクリプトが <html data-theme> を付ける。
 */
const lightTokens = `
  color-scheme: light;
  --bg: #f8fafc;
  --bg-translucent: rgb(255 255 255 / 0.8);
  --surface: #ffffff;
  --surface-hover: #f8fafc;
  --surface-muted: #f1f5f9;
  --surface-inset: #f1f5f9;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --text-strong: #0f172a;
  --text: #1e293b;
  --text-body: #334155;
  --text-muted: #475569;
  --text-subtle: #64748b;
  --text-faint: #94a3b8;
  --accent: #2563eb;
  --accent-indigo: #4f46e5;
  --accent-purple: #9333ea;
  --accent-emerald: #059669;
  --accent-rose: #e11d48;
  --button-bg: #0f172a;
  --button-bg-hover: #1e293b;
  --button-text: #ffffff;
  --danger: #dc2626;
  --danger-surface: #fef2f2;
  --grid-line: rgb(15 23 42 / 0.05);
  --glow-blue: rgb(96 165 250 / 0.1);
  --glow-indigo: rgb(129 140 248 / 0.1);
`

const darkTokens = `
  color-scheme: dark;
  --bg: #020617;
  --bg-translucent: rgb(2 6 23 / 0.8);
  --surface: rgb(15 23 42 / 0.4);
  --surface-hover: rgb(15 23 42 / 0.8);
  --surface-muted: rgb(30 41 59 / 0.5);
  --surface-inset: rgb(2 6 23 / 0.5);
  --border: #1e293b;
  --border-strong: #334155;
  --text-strong: #ffffff;
  --text: #e2e8f0;
  --text-body: #cbd5e1;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;
  --text-faint: #475569;
  --accent: #60a5fa;
  --accent-indigo: #818cf8;
  --accent-purple: #c084fc;
  --accent-emerald: #34d399;
  --accent-rose: #fb7185;
  --button-bg: #ffffff;
  --button-bg-hover: #e2e8f0;
  --button-text: #000000;
  --danger: #f87171;
  --danger-surface: rgb(127 29 29 / 0.3);
  --grid-line: rgb(255 255 255 / 0.03);
  --glow-blue: rgb(30 58 138 / 0.2);
  --glow-indigo: rgb(49 46 129 / 0.1);
`

export const globalStyles = `
@layer base, rmx;

@layer base {
  :root { ${lightTokens} }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) { ${darkTokens} }
  }
  :root[data-theme='dark'] { ${darkTokens} }

  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
    -webkit-text-size-adjust: 100%;
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
  body {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ::selection { background: #3b82f6; color: #ffffff; }
  img, svg { display: block; max-width: 100%; }
  a { color: inherit; text-decoration: inherit; }
  button, input, textarea { font: inherit; color: inherit; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  @keyframes reveal {
    from { opacity: 0; transform: translateY(3rem); }
    to { opacity: 1; transform: none; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(1.25rem); }
    to { opacity: 1; transform: none; }
  }
  @keyframes ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}
`

/**
 * 明示的に選ばれたテーマを描画前に反映する。
 * HTML をキャッシュできるよう、テーマはサーバーでは読まない。
 */
export const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);if(m)document.documentElement.dataset.theme=m[1]}catch(e){}})()`
