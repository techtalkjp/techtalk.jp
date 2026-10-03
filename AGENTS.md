# AGENTS.md

This file provides guidance to coding agents (Codex など) when working with code in this repository.

## Development Commands

- `pnpm dev` - esbuild (client, watch) と `wrangler dev` を並列で起動（http://localhost:8787）
- `pnpm build` - ブラウザ用バンドルを `public/js/` に出力
- `pnpm deploy` - build して Cloudflare Workers にデプロイ
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
- `app/router.ts` - ミドルウェア（logger, cop, formData, bindings, render）とルートの割り当て
- `app/controllers/` - ルートごとのハンドラ。`context.render(<Page />)` で HTML を返す
- `app/ui/` - サーバー描画のコンポーネント。スタイルは `css()` mixin、トークンは `app/ui/global-styles.ts` の CSS 変数
- `app/islands/` - ブラウザでハイドレーションするコンポーネント（`clientEntry('/js/islands.js#Name', ...)`）。`client/islands.ts` に同名で export を足す
- `client/entry.ts` - `run()` でアイランドを読み込み、ソフトナビゲーションを有効にする
- `app/contact/` - 問い合わせのスキーマ（`remix/data-schema`）、honeypot、営業スコア、Workflow への投入
- `app/i18n/` - `t('日本語の文言')` で翻訳。英訳は `app/i18n/en.json`（日本語の文言がキー）。`I18nProvider` / `getI18n(handle)` でツリーに渡す
- `workers/workflow/` - `ContactWorkflow`（Workers AI で営業判定 → 評価ログ → Slack → 通知メール・自動返信）。メールは `renderToString` で JSX から作る

## 決まりごと

- ブラウザ用 JS は esbuild で 1 回にまとめてビルドする（`--splitting`）。`remix/assets` は Node 専用なので使わない
- バインディングは `cloudflare:workers` から import せず、`context.bindings`（`app/middleware/bindings.ts`）経由で使う。テストでは偽物を渡す
- 問い合わせフォームはトップの `<Frame name="contact">`。送信は `data-rmx-target="contact"` でフォーム部分だけ差し替える。JS なしでも動くこと
- テーマは cookie `theme` をブラウザだけで読み、`<html data-theme>` を付ける（HTML をキャッシュ可能に保つため、サーバーでは読まない）
- アイランドの props はシリアライズ可能な値だけ。翻訳済みの文字列を渡す
- workerd では `handle.signal` を `addEventListener` の `signal` に渡せないので、イベント購読はブラウザでだけ行う
- `@remix-run/ui` は 0.x なのでバージョンを固定している。上げるときは差分を確認する
- `remix/data-table` は D1 ドライバがないので使わない。D1 は `prepare()` で直接使う
