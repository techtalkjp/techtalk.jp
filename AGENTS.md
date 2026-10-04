# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex など) when working with code in this repository. CLAUDE.md はこのファイルを読み込むだけにしている。

## Development Commands

- `pnpm dev` - `wrangler dev`（http://localhost:8787）。ブラウザ用バンドルは wrangler の build.command が作り、app/ と client/ の変更で作り直す
- `pnpm build` - ブラウザ用バンドルを `public/js/` に出力
- `pnpm run deploy` - `wrangler deploy`（build.command でバンドルを作ってからデプロイ）。`pnpm deploy` は pnpm 組み込みのコマンドなので使わない
- `pnpm test` - `remix test`（`test/**/*.test.{ts,tsx}`）
- `pnpm typecheck` / `pnpm lint` / `pnpm format` / `pnpm format:fix`
- `pnpm validate` - format, lint, typecheck, test を並列実行
- `pnpm typegen` - `worker-configuration.d.ts` を再生成（secrets は `.env.example` から）
- `pnpm migrations:apply` / `pnpm migrations:apply:production` - D1 マイグレーション

変更後は必ず `pnpm validate` を通す。

## Architecture

Remix 3（`remix@3.0.0`）を Cloudflare Workers で動かしている。React ではなく `remix/component` の JSX（`jsxImportSource: "remix/component"`、hooks なし）を使う。Remix のソースは `~/.opensrc/repos/github.com/remix-run/remix/3.0.0` にある（`pnpm dlx opensrc path remix@3.0.0`）。

- `worker.ts` - Worker のエントリ。`createAppRouter({ bindings })` を isolate ごとに作り、`ContactWorkflow` を re-export する
- `app/routes.ts` - URL の定義。パターンは先頭 `/` なしで書く（`(:lang)` はロケール。ja は接頭辞なし、en は `/en`）
- `app/router.ts` - 全体のミドルウェア（logger, canonicalPath, cop, bindings, render）とルートの割り当て。フォームの解析は問い合わせのルートだけに `contactFormData()`（上限つき、400/413）を掛ける。ロケールは `(:lang)` のルートに `locale()` を掛け、`context.i18n` で受け取る
- `app/controllers/` - ルートごとのハンドラ。`context.render(<Page />)` で HTML を返す
- `app/ui/` - サーバー描画のコンポーネント。スタイルは `css()` mixin、トークンは `app/ui/global-styles.ts` の CSS 変数
- `app/islands/` - ブラウザでハイドレーションするコンポーネント（`clientEntry('/js/entry.js#Name', ...)`）。`client/islands.ts` に同名で export を足す
- `client/entry.ts` - `run()` を起動する。アイランドも同じファイルにまとめて入れる（`/js/entry.js` 1 本）
- `app/contact/` - 問い合わせのスキーマ（`remix/data-schema`）、honeypot、営業スコア、Workflow への投入
- `app/i18n/` - `t('日本語の文言')` で翻訳。英訳は `app/i18n/en.json`（日本語の文言がキー）。`t()` の引数は en.json のキーに型で縛っているので、文言を変えたら en.json のキーも直す（直さないと typecheck が落ちる）。`I18nProvider` / `getI18n(handle)` でツリーに渡す
- `workers/workflow/` - `ContactWorkflow`。Workers AI で営業判定 → 評価ログ → 通知メールと Slack を並べて送る（片方が失敗してももう片方は送る。両方失敗したら自動返信を送らずに Workflow を失敗にする）→ 自動返信（入力内容は載せない。失敗は記録だけ）。メールは `renderToString` で JSX から作る

## 決まりごと

- ブラウザ用 JS は esbuild で `public/js/entry.js` 1 本にまとめる（デプロイ前後で古いページと新しいチャンクが混ざらないように）。`remix/assets` は Node 専用なので使わない
- バインディングは `cloudflare:workers` から import せず、`context.bindings`（`app/middleware/bindings.ts`）経由で使う。テストでは偽物を渡す
- 問い合わせフォームはトップの `<Frame name="contact">`。JS ありの送信は `data-rmx-src` で `/contact-form` に送り、フォーム部分だけ差し替える。JS なしの送信はトップの URL が受ける。どちらも動くこと
- テーマは OS の設定（`prefers-color-scheme`）に従うだけで、切り替え UI は置かない
- デザインのトークン（色、文字サイズ 12/14/16/18/20/28/display、角丸 6px/12px）は `app/ui/global-styles.ts` にある。色はアクセント 1 色（青）と無彩色だけ。新しい値を足す前にトークンで済まないか考える
- 固定・大きなレイヤーに blur、backdrop-filter、mask を使わない（iOS Safari でスクロール中の描画が遅れる）
- アイランドの props はシリアライズ可能な値だけ。翻訳済みの文字列を渡す
- workerd では `handle.signal` を `addEventListener` の `signal` に渡せないので、イベント購読はブラウザでだけ行う
- `remix/data-table` は D1 ドライバがないので使わない。D1 は `prepare()` で直接使う
