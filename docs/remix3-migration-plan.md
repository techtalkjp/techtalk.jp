# techtalk.jp を Remix 3 へ一括移行する計画

調査日: 2026-10-03。参照ソース: `~/.opensrc/repos/github.com/remix-run/remix/3.0.0`（opensrc で取得）。

## 方針

- `remix@3.0.0`（2026-10-01 stable）に全面移行する。React、react-router、Tailwind、zod、Kysely、Vite はすべて外す
- できるだけ Remix ネイティブで組む。スタイルは `css()`、検証は `remix/data-schema`、cookie は `remix/cookie`、インタラクションは `clientEntry` アイランド、ページ遷移は `run()` のソフトナビゲーション、テストは `remix test` を使う
- Remix に代替がない部分だけ自前で書く。対象は Workers 向けのクライアントビルド（esbuild）、i18n の辞書、D1 アクセス
- `/demo/*` と関連テーブル、R2 連携は削除する

## スパイクで確認したこと

`remix@3.0.0` と wrangler 4 の最小構成を `wrangler dev` で動かし、Chrome で操作した。

| 確認項目                                                                 | 結果                                                                                    |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `remix/component` の SSR（`render()` ミドルウェア、assets なし）         | OK。`nodejs_compat` も不要                                                              |
| `css()` mixin                                                            | OK。SSR 時に `<style data-rmx-style>` として head に集められ、`@layer rmx` に入る       |
| `clientEntry('/js/islands.js#Counter', ...)` と esbuild の事前ビルド     | OK。ブラウザでハイドレーションされ、クリックで状態が更新される                          |
| `run()` によるソフトナビゲーション                                       | OK。フォーム送信がページ全体のリロードにならず、アイランドの状態も保たれる              |
| `formData()` ミドルウェアと `remix/data-schema/form-data` の `parseSafe` | OK。不正入力には 400 で再描画する                                                       |
| ロケール付きルート `(:lang)` / `(:lang/)biography`                       | `/`, `/en`, `/biography`, `/en/biography` が一致。`/fr` はハンドラ側の判定で 404 を返す |
| Workers Static Assets                                                    | OK                                                                                      |
| サーバーのバンドルサイズ                                                 | 205 KiB（gzip 46 KiB）                                                                  |
| クライアント runtime（esbuild で minify）                                | 99 KB（gzip 32 KB）                                                                     |

注意点:

- ルートパターンは先頭 `/` なしで書く。`(/:lang)/` は一致しない
- JSX の属性名は `class`（`className` ではない）
- アイランドは server と browser で同じモジュールを使う。`remix/component` のコピーが分かれないよう、esbuild は `--splitting` で 1 回にまとめてビルドする

## スコープ

### 残して作り直す

| ページ・機能                                                           | 移行後                                                                                                                                                                           |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`, `/en`（Hero / Products / Services / Profile / Company / Contact） | `(:lang)`                                                                                                                                                                        |
| `/biography`, `/en/biography`                                          | `(:lang/)biography`                                                                                                                                                              |
| `/privacy`（MDX）                                                      | TSX に一度だけ変換する                                                                                                                                                           |
| 問い合わせ（honeypot、scoreSales、Workflow 起動）                      | トップの `<Frame name="contact">` にし、POST 先はトップ自身の URL（`form('(:lang)')` の action）にする。ロジックは移植する（下記「Remix 3 で良くする点」）                       |
| `/healthcheck`                                                         | `get('healthcheck')`                                                                                                                                                             |
| `ContactWorkflow`（Workers AI 分類、評価ログ、Slack、メール 2 通）     | ロジックは維持する。メールは `remix/component` の `renderToString` で JSX から HTML にする                                                                                       |
| i18n                                                                   | 既存の `t()` と `en.json` を、i18n デモと同じ「middleware → `context.i18n` → `I18nProvider`（`handle.context`）」の形に載せ替える                                                |
| テーマ（light / dark / system）                                        | 選択は cookie に保存するが、サーバーでは読まない。描画前のインラインスクリプトが `html` に class を付ける。トグルはアイランドで、cookie の書き込みは `remix/cookie` で組み立てる |
| SEO（OGP、canonical、hreflang、JSON-LD）                               | `<Document>` の `head` props で出す                                                                                                                                              |

### 削除する

- `/demo/*` 全部、`/resources/*`、`/demo/api/fts`、`public/fts-search.js` と `vite.config.web-component.ts`
- `app/` 配下の既存コード一式（`ai-elements/`、shadcn の `ui/` を含む）
- D1 の不要テーブル: `sample_orders`、`fts_contents`、`fts_index`（FTS5）、`uploaded_files`。`migrations/0005_drop_demo_tables.sql` で DROP する
- R2 バインディング。バケット `techtalk` の中身は今回は触らない
- 依存関係: React 一式、react-router 一式、Tailwind 一式、radix、conform、zod、remix-toast、sonner、framer-motion、motion、`ai` と `@ai-sdk/*`、kysely 一式、aws4fetch、dnd-kit、faker、duckdb、mdx、react-email、lucide-react、vite と vite-plus、visualizer など
- secrets: `TECHTALK_S3_URL`、`IMAGE_ENDPOINT_URL`、`AI_GATEWAY_API_KEY`、`SENDGRID_API_KEY`、Google OAuth 系、`SESSION_SECRET`、`TOKEN_ENCRYPTION_SECRET`
- `nodejs_compat_populate_process_env`。`nodejs_compat` も外す（mimetext が動かなければ戻す）

### Remix ネイティブへの対応表

| 現在                                | 移行後                                                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tailwind v4                         | `css()` mixin。色・余白・フォントは CSS 変数のトークンにし、`<Document>` のルート要素で定義する。ダークモードは `html.dark` と `prefers-color-scheme` でトークンを切り替える                                 |
| shadcn / Radix                      | `@remix-run/ui` の `menu` / `popover` をアイランド内で使う（言語切替とテーマ切替のドロップダウン、モバイルメニュー）。ダイアログ部品はないので `<dialog>`。言語切替のリンクには `data-rmx-document` を付ける |
| Conform + zod                       | `remix/data-schema` と `remix/data-schema/form-data`                                                                                                                                                         |
| remix-toast / sonner                | 完了状態をページに描画する                                                                                                                                                                                   |
| react-router のファイルルーティング | `app/routes.ts` と `app/controllers/`                                                                                                                                                                        |
| loader / action                     | コントローラの action で取得して `render(<Page />)` する                                                                                                                                                     |
| `useFetcher`                        | 普通の `<form>`。`run()` がソフトナビゲーションにしてくれる                                                                                                                                                  |
| 送信中表示                          | `ContactForm` アイランドで `on('submit')` を拾い、ボタンを無効化する                                                                                                                                         |
| モバイルメニュー、テーマトグル      | アイランド                                                                                                                                                                                                   |
| スクロールアニメーション 2 系統     | CSS の scroll-driven animations（`animation-timeline: view()`）で JS なしにする。未対応ブラウザでは単に表示される                                                                                            |
| スムーススクロール                  | CSS の `scroll-behavior` と `scroll-margin-top`                                                                                                                                                              |
| lucide-react                        | 使っているアイコンをインライン SVG コンポーネントにする                                                                                                                                                      |
| react-email                         | `renderToString` で JSX から HTML を作る。メールなのでスタイルは `style` 属性に書く                                                                                                                          |
| Kysely                              | `env.DB.prepare` を middleware の `context.db` 経由で使う。`remix/data-table` は D1 ドライバがないため使わない（下記）                                                                                       |
| CSRF 対策（なし）                   | `remix/middleware/cop`（トークン不要の cross-origin 保護）を POST に掛ける                                                                                                                                   |
| リダイレクト・HTML 応答             | `remix/response` のヘルパー                                                                                                                                                                                  |
| Cache-Control                       | `remix/headers` で組み立てる                                                                                                                                                                                 |
| ログ                                | `remix/middleware/logger`                                                                                                                                                                                    |
| テスト（なし）                      | `remix test` と `remix/assert` で router の単体テストを書く                                                                                                                                                  |
| ルート確認                          | `remix routes` / `remix doctor`（CLI）                                                                                                                                                                       |
| vite-plus                           | `oxlint` と `oxfmt` を直接使う                                                                                                                                                                               |

## Remix 3 で良くする点

スパイクで動作を確認したものに ✔ を付けた。

- ✔ **問い合わせフォームを Frame にする。** 送信するとフォーム部分だけがサーバーから描き直される。URL・スクロール位置・履歴は変わらず、ページ上のアイランドの状態も残る。現行の `useFetcher` + トーストと同じ体験を、JS なしでも動く普通の `<form>` で実現できる。POST 先をページ自身の URL にするので、ロケールも URL から分かる
- ✔ **ページ間のソフトナビゲーション。** `/` ⇄ `/biography` の移動は `run()` がドキュメントを差分更新する。ヘッダーのアイランド（テーマ切替など）は状態を保ったまま残る。言語切替だけは i18n デモに倣い `data-rmx-document` で完全遷移にする
- **ブラウザ標準の入力検証を使う。** Remix はネイティブの制約検証を通してから送信を横取りするので、HTML 属性だけで送信前の検証が効く
- **送信中表示は送信ボタンのアイランドで出す。** フォームの submit で送信中にし、Frame の `reloadComplete` で解く（実装メモ: クリック時に disabled にすると送信が止まる）
- **出現アニメーションを `@remix-run/ui/animation` で付ける。** 完了メッセージとモバイルメニューの開閉に `animateEntrance` / `animateExit` を使う。スクロール連動の演出は CSS の scroll-driven animations のまま
- **ページの HTML を全員同じにする。** 問い合わせが POST と Frame に分かれたので、GET のページは言語ごとに固定の HTML になる。テーマはブラウザだけで cookie を読む。（実装メモ: Worker が返す HTML は Cloudflare のエッジに自動ではキャッシュされないため、`Cache-Control: public, max-age=0, must-revalidate` にとどめた。エッジキャッシュが必要になったら Cache API を使う）

## Remix v3 モジュールの採否

✅ 使う / ➖ 使わない / ⛔ Workers で動かない（Node 専用）

| モジュール                                                                           | 用途                                        | 採否                                                  |
| ------------------------------------------------------------------------------------ | ------------------------------------------- | ----------------------------------------------------- |
| `remix`                                                                              | メタパッケージ                              | ✅                                                    |
| `fetch-router`, `route-pattern`                                                      | ルーター、URL パターンと型付き href         | ✅                                                    |
| `form-data-middleware`, `form-data-parser`, `multipart-parser`                       | フォームデータの解析                        | ✅                                                    |
| `render-middleware`                                                                  | `context.render()`                          | ✅                                                    |
| `logger-middleware`                                                                  | リクエストログ                              | ✅                                                    |
| `cop-middleware`                                                                     | トークン不要の cross-origin 保護            | ✅ 問い合わせの POST                                  |
| `response`, `headers`, `mime`                                                        | Response の生成、ヘッダー操作、MIME 判定    | ✅                                                    |
| `component`                                                                          | JSX ランタイム（SSR とハイドレーション）    | ✅                                                    |
| `ui`                                                                                 | ヘッドレス UI 部品（menu, popover など）    | ✅ 0.12.1 に固定                                      |
| `data-schema`                                                                        | スキーマ検証                                | ✅ zod の代わり                                       |
| `cookie`                                                                             | Cookie の読み書き                           | ✅ テーマ（クライアントでの書き込み）                 |
| `test`, `assert`                                                                     | テストとアサーション                        | ✅                                                    |
| `cli`                                                                                | `remix routes` / `doctor` / `test`          | ✅                                                    |
| `csrf-middleware`                                                                    | トークン方式の CSRF 対策（セッション前提）  | ➖ cop で足りる                                       |
| `cors-middleware`, `method-override-middleware`, `fetch-proxy`                       | CORS、メソッド上書き、プロキシ              | ➖ 用途なし                                           |
| `async-context-middleware`                                                           | AsyncLocalStorage でコンテキストを保持      | ➖ `nodejs_compat` が必要で、用途もない               |
| `html-template`                                                                      | エスケープ付き HTML テンプレートタグ        | ➖ メールは `renderToString` で作る                   |
| `multiple-import-maps-polyfill`                                                      | import map を後から追加するためのポリフィル | ➖ esbuild で 1 回にまとめてビルドするので不要        |
| `spa`                                                                                | クライアントだけで動く SPA 用ルーティング   | ➖                                                    |
| `data-table`（+ `-sqlite` / `-mysql` / `-postgres`）                                 | 型付きのクエリ層とマイグレーション          | ➖ D1 用のドライバがない                              |
| `session`, `session-middleware`, `session-storage-redis`, `session-storage-memcache` | セッション管理                              | ➖ ログイン機能がない                                 |
| `auth`, `auth-middleware`                                                            | ログイン、OAuth、OIDC                       | ➖                                                    |
| `file-storage`, `file-storage-s3`, `lazy-file`, `fs`, `tar-parser`                   | ファイル保存、tar の解析                    | ➖ アップロード機能がない                             |
| `assets`, `component-hmr`                                                            | アセットをリクエストごとにコンパイル、HMR   | ⛔ esbuild で代替                                     |
| `static-middleware`, `compression-middleware`                                        | 静的ファイル配信、圧縮                      | ⛔ Workers Static Assets と Cloudflare 側の圧縮で代替 |
| `node-fetch-server`, `node-hmr`, `node-tsx`, `terminal`                              | Node 用サーバー、HMR、TS 実行、端末出力     | ⛔ 不要                                               |

## 構成

```
worker.ts                  # fetch: createAppRouter(env).fetch(req)、ContactWorkflow を re-export
app/
  routes.ts                # URL の定義（型付き href）
  router.ts                # createAppRouter(env): logger, cop, formData, bindings, i18n, render
  middleware/
    bindings.ts            # context.db / context.workflow（env を引数で受けて差し替え可能にする）
    i18n.ts                # (:lang) からロケールを決め、context.i18n を作る
  controllers/
    home.tsx               # GET はページ、POST は問い合わせ（Frame 用の断片 or 303）
    contact-frame.tsx      # GET (:lang/)contact-form: フォームの断片
    biography.tsx  privacy.tsx  healthcheck.ts
  ui/
    document.tsx           # <html lang class>、head（SEO、トークン、テーマ用スクリプト、entry.js）
    tokens.ts              # デザイントークン（CSS 変数）
    i18n.tsx               # I18nProvider / getI18n
    icons.tsx
    home/  biography/  privacy/
  islands/                 # clientEntry('/js/islands.js#X', ...) のコンポーネント
    theme-toggle.tsx  mobile-menu.tsx  submit-button.tsx
  i18n/en.json
  contact/                 # schema（data-schema）、honeypot、scoreSales、types（Workflow と共有）
client/
  entry.ts                 # run({ loadModule })
  islands.ts               # app/islands/* を re-export
workers/workflow/contact.ts
workers/workflow/emails/*.tsx   # renderToString 用の JSX
public/                    # js/（esbuild の出力、gitignore）、og-image、favicon、logo
migrations/                # 0004 を使う。0005 で demo テーブルを DROP
test/*.test.ts             # remix test
```

`router.fetch` は `Request` しか受け取らない。そこで `createAppRouter(env)` を isolate ごとに 1 回作り、env をクロージャで渡す。こうすると `cloudflare:workers` を import せずに済み、テストでは偽の env を渡せる。

## 実施手順（ブランチ `remix3` で一括）

1. **土台**
   - `app/`、`vite*.ts`、`react-router.config.ts`、`.oxlintrc` の ui 関連の除外設定などを削除する
   - `pnpm-workspace.yaml` に `minimumReleaseAgeExclude: ['remix@3.0.0', '@remix-run/*']` を追加する。`minimumReleaseAge: 10080`（7 日）のため、2026-10-01 公開の remix は `pnpm install` で弾かれる
   - 依存は remix、`@remix-run/ui`（バージョン完全固定）、mimetext、wrangler、esbuild、typescript、oxlint、oxfmt、lefthook に絞る
   - tsconfig は `jsxImportSource: remix/component`、`moduleResolution: Bundler` にする
   - wrangler.jsonc は `main: worker.ts`、`assets.directory: ./public` にし、R2 と互換フラグを外す
   - scripts: `build:client`（esbuild）、`dev`（esbuild の watch と `wrangler dev` を並列）、`build`、`deploy`、`typecheck`、`lint`、`format`、`test`、`validate`
2. **ルーターと Document**
   - `routes.ts`、`router.ts`、middleware 3 本、`document.tsx`、`tokens.ts` を作る
   - 404 ページと、worker.ts の try/catch による 500 応答を入れる
3. **ページ**
   - トップの各セクション、経歴、プライバシーポリシーを `css()` で書き直す。現行サイトのスクリーンショットを横に置き、見た目を揃える
4. **アイランドとクライアント**
   - `client/entry.ts`、テーマトグル、モバイルメニューを作る
   - esbuild でビルドし、ソフトナビゲーションとハイドレーションをブラウザで確認する
5. **問い合わせ**
   - `remix/data-schema` でスキーマを作り、honeypot、scoreSales、Workflow 起動を移す
   - フォームは `<Frame name="contact" src="(:lang/)contact-form">`（fallback なし＝SSR 時に解決）で埋め込む。`<form method="post" data-rmx-target="contact" data-rmx-reset-scroll="false">` で、action は空（＝今のページ URL）
   - POST ハンドラは `X-Remix-Frame: true` ならフォーム断片（エラー時 400、成功時は完了表示）を返す。JS なしの通常送信なら成功時 `303 → /{lang}?sent=1#contact`、エラー時 400 でトップ全体を再描画する
   - `required`、`type="email"`、`maxlength` を付け、ブラウザ標準の検証を先に効かせる（Remix は submit 時にネイティブ検証を通してから横取りする）
   - 送信ボタンを小さなアイランドにし、フォームの submit で送信中にして Frame の `reloadComplete` で解く
6. **Workflow**
   - メール 2 本を JSX と `renderToString` で書き直す
   - 型の import 元を `app/contact/types.ts` に移す
   - Workers AI の分類、評価ログ、Slack 通知、営業判定時の通知抑止は変えない
7. **DB**
   - `0005_drop_demo_tables.sql` を追加する。ローカルで適用して確認し、本番には deploy の後に適用する
8. **テスト・ツール・CI・ドキュメント**
   - `remix test` で router のテストを書く（後述の受け入れ条件をそのままテストにする）
   - lefthook、CI（`pnpm validate && pnpm test && pnpm build && wrangler deploy --dry-run`）を更新する
   - CLAUDE.md と AGENTS.md を書き直す
9. **リリース**
   - `wrangler dev` と Chrome で全ページを確認し、`deploy` する。その後に D1 migration の適用と不要な secrets の削除を行う

## 受け入れ条件

- 次の URL が 200 を返し、`<html lang>` が正しい: `/`, `/en`, `/biography`, `/en/biography`, `/privacy`, `/healthcheck`
- `/fr` と `/fr/biography` が 404 を返す
- 問い合わせ
  - JS あり: 送信後もURL・スクロール位置・履歴が変わらず、Frame 部分だけが完了表示かエラー表示に変わる
  - JS なし: 正常な入力で 303 → `/{lang}?sent=1#contact`、検証エラーで 400 とエラー・入力値の再表示
  - どちらの場合も正常な入力で Workflow が起動し、honeypot が埋まっていたら起動しない
  - `/en` から送るとエラー文言・完了表示・リダイレクト先が英語になる
- OGP、canonical、hreflang、JSON-LD が現行サイトと一致する（現行の HTML と diff を取る）
- ブラウザ確認: テーマ切替が cookie に残る、モバイルメニューが開閉する、ページ遷移でコンソールエラーが出ない、JS を切ってもページとフォームが動く
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`wrangler deploy --dry-run` が通る

## 失うもの

- すべてのデモページと、そのデータ（D1 テーブル）
- Conform によるリアルタイム検証（ブラウザ標準の検証とサーバー検証に置き換わる）
- コンポーネント単位の HMR。esbuild の watch と `wrangler dev` の再読み込みで代替する

## リスクと未確認事項

- 公式の Workers テンプレートはない。esbuild によるクライアントビルドはスパイクで動いたが、`remix/assets` の import map や modulepreload は使わない独自構成になる
- ガイドの「Production」「Errors」章はまだ空。エラー処理とキャッシュヘッダーは自前で決める
- ソフトナビゲーションには Navigation API と `NavigateEvent.sourceElement` が必要。未対応ブラウザでは通常のページ遷移になる
- `css()` は CSS 変数を使ってもダークモードの切り替えを `html.dark` 側で持つ必要がある。トークンの設計を最初に決める
- `@remix-run/ui` は 0.12.1 で、README に unstable と明記されている。バージョンを完全固定し、上げるときは差分を確認する
- `remix/data-table` を使わない理由: 汎用のクエリ層は Workers で動くが、ドライバは SQLite / MySQL / Postgres のみ。SQLite ドライバは同期クライアント前提で、読み込み時に `node:fs` を import する。D1 用を自作するには SQL 生成部（SQLite 用 約 490 行は非公開）も書く必要があり、D1 は呼び出しをまたぐトランザクションもない。必要なクエリは 2 本だけなので見送る

## 付録: スパイクの最小コード（`wrangler dev` と Chrome で動作確認済み）

```jsonc
// wrangler.jsonc（compatibility_flags なし）
{
  "name": "spike",
  "main": "worker.ts",
  "compatibility_date": "2026-09-01",
  "assets": { "directory": "./public", "binding": "ASSETS" },
}
```

```jsonc
// tsconfig.json（抜粋）
{
  "types": ["@cloudflare/workers-types"],
  "module": "ESNext",
  "moduleResolution": "Bundler",
  "allowImportingTsExtensions": true,
  "verbatimModuleSyntax": true,
  "jsx": "react-jsx",
  "jsxImportSource": "remix/component",
  "noEmit": true,
}
```

```ts
// app/routes.ts（パターンは先頭 / なし）
import { form, get, route } from 'remix/routes'
export const routes = route({
  home: '(:lang)',
  bio: '(:lang/)biography',
  contact: form('api/contact'),
  health: get('/healthcheck'),
})
```

```ts
// app/router.ts
import { createRouter, type MiddlewareContext } from 'remix/router'
import { formData } from 'remix/middleware/form-data'
import { render } from 'remix/middleware/render'
const renderMiddleware = render() // assets なし。clientEntry は公開 URL で指定する
const formDataMiddleware = formData()
type AppContext = MiddlewareContext<
  [typeof formDataMiddleware, typeof renderMiddleware]
>
declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}
export const router = createRouter<AppContext>({
  middleware: [formDataMiddleware, renderMiddleware],
})
```

```tsx
// app/controller.tsx（抜粋）
import { createController } from 'remix/router'
import * as s from 'remix/data-schema'
import * as f from 'remix/data-schema/form-data'
const schema = f.object({ email: f.field(s.string()) })
const langOf = (l?: string) =>
  l === undefined ? 'ja' : l === 'en' ? 'en' : null
router.map(routes.home, ({ params, render }) => {
  const lang = langOf(params.lang)
  if (!lang) return new Response('Not Found', { status: 404 })
  return render(<Home lang={lang} />)
})
router.map(
  routes.contact,
  createController(routes.contact, {
    actions: {
      index: ({ render }) => render(<Home lang="ja" />),
      action({ formData, render }) {
        const r = s.parseSafe(schema, formData)
        if (!r.success)
          return render(<Home lang="ja" error="invalid" />, { status: 400 })
        return render(<Home lang="ja" sent />)
      },
    },
  }),
)
```

```tsx
// app/islands/counter.tsx（server と browser で共有）
import { clientEntry, css, on, type Handle } from 'remix/component'
export const Counter = clientEntry(
  '/js/islands.js#Counter',
  function Counter(handle: Handle<{ start: number }>) {
    let n = handle.props.start
    return () => (
      <button
        type="button"
        mix={[
          css({ color: 'tomato' }),
          on('click', () => {
            n++
            handle.update()
          }),
        ]}
      >
        count {n}
      </button>
    )
  },
)
```

```ts
// client/entry.ts
import { run } from 'remix/component'
const app = run({
  async loadModule(moduleUrl, exportName) {
    const mod = await import(moduleUrl)
    return mod[exportName]
  },
})
app.addEventListener('error', (e: any) => console.error(e.error))
await app.ready()
// client/islands.ts: export { Counter } from '../app/islands/counter.tsx'
```

```sh
esbuild client/entry.ts client/islands.ts --bundle --splitting --format=esm \
  --outdir=public/js --jsx=automatic --jsx-import-source=remix/component --minify \
  '--entry-names=[name]' '--chunk-names=chunk-[hash]'
```

```tsx
// Document の head に置く
<script type="module" src="/js/entry.js"></script>
```

```ts
// worker.ts
import './app/controller.tsx'
import { router } from './app/router.ts'
export default {
  fetch: (req: Request) => router.fetch(req),
} satisfies ExportedHandler
```
