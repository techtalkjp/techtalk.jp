# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex など) when working with code in this repository. CLAUDE.md はこのファイルを読み込むだけにしている。

## Development Commands

- `pnpm dev` - Portless 経由で `wrangler dev`（https://techtalk.localhost、worktree では名前の接頭辞つき）。Portless の `PORT` を `--port` に渡す。`PORTLESS=0 pnpm dev` で http://localhost:8787 に直接起動できる。ブラウザ用バンドルは wrangler の build.command が作り、app/ と client/ の変更で作り直す
- `pnpm build` - ブラウザ用バンドルを `public/js/` に出力
- `pnpm fonts:build` - uv で LINE Seed JP の WOFF2 サブセットを再生成。dev の監視・build・validate・deploy で `fonts:ensure` が必要なときだけ自動再生成する。生成物もコミットする。再生成には uv が必要
- `pnpm run deploy` - `wrangler deploy`（build.command でバンドルを作ってからデプロイ）。本番へは main へのマージで Workers Builds が自動でデプロイするので、手元から出すのは出し直すときだけ。`pnpm deploy` は pnpm 組み込みのコマンドなので使わない
- `pnpm test` - `remix test`（`test/**/*.test.{ts,tsx}`）
- `pnpm typecheck` / `pnpm lint` / `pnpm format` / `pnpm format:fix`
- `pnpm validate` - `fonts:ensure` のあと、format, lint, typecheck, test, fonts:check を並列実行
- `pnpm typegen` - `worker-configuration.d.ts` を再生成（secrets は使っていないので、手元の `.env` は読ませない）

変更後は必ず `pnpm validate` を通す。

## Architecture

Remix 3（`remix@3.0.0`）を Cloudflare Workers で動かしている。React ではなく `remix/component` の JSX（`jsxImportSource: "remix/component"`、hooks なし）を使う。Remix のソースは `~/.opensrc/repos/github.com/remix-run/remix/3.0.0` にある（`pnpm dlx opensrc path remix@3.0.0`）。

- `worker.ts` - Worker のエントリ。`createAppRouter()` を isolate ごとに作る
- `app/routes.ts` - URL の定義。パターンは先頭 `/` なしで書く（`(:lang)` はロケール。ja は接頭辞なし、en は `/en`）
- `app/router.ts` - 全体のミドルウェア（logger, canonicalPath, cop, render）とルートの割り当て。ロケールは `(:lang)` のルートに `locale()` を掛け、`context.i18n` で受け取る
- `app/controllers/` - ルートごとのハンドラ。`context.render(<Page />)` で HTML を返す
- `app/ui/` - サーバー描画のコンポーネント。スタイルは `css()` mixin、トークンは `app/ui/global-styles.ts` の CSS 変数
- `app/islands/` - ブラウザでハイドレーションするコンポーネント（`clientEntry('/js/entry.js#Name', ...)`）。`client/islands.ts` に同名で export を足す
- `client/entry.ts` - `run()` を起動する。アイランドも同じファイルにまとめて入れる（`/js/entry.js` 1 本）
- `app/i18n/` - `t('日本語の文言')` で翻訳。英訳は `app/i18n/en.json`（日本語の文言がキー）。`t()` の引数は en.json のキーに型で縛っているので、文言を変えたら en.json のキーも直す（直さないと typecheck が落ちる）。SEO の説明文のように `t()` を通さない文言は型で守られないので、日英を見比べて直す。`I18nProvider` / `getI18n(handle)` でツリーに渡す

## 決まりごと

- 見た目を変えるときは `DESIGN.md`（トークン、部品、やらないこと）に従う。誰に何を伝えるサイトか、出してよい実績は何かは `PRODUCT.md` にある
- ブラウザ用 JS は esbuild で `public/js/entry.js` 1 本にまとめる（デプロイ前後で古いページと新しいチャンクが混ざらないように）。`remix/assets` は Node 専用なので使わない
- 問い合わせはフォームで受けない（営業ツールの送信ばかりになったため閉じた）。トップの問い合わせのセクションから、代表の Facebook へ Messenger（`MESSENGER_URL`、`app/config.ts`）で送ってもらう。POST を受けるルートを足さない
- テーマは OS の設定（`prefers-color-scheme`）に従うだけで、切り替え UI は置かない
- デザインのトークン（色、文字サイズ 12/14/16/18/20/28/40/display、角丸 8px/16px とボタンのピル）は `app/ui/global-styles.ts` にある。色はアクセント 1 色（青）と無彩色だけ。新しい値を足す前にトークンで済まないか考える
- 固定・大きなレイヤーに blur、backdrop-filter、mask を使わない（iOS Safari でスクロール中の描画が遅れる）
- アイランドの props はシリアライズ可能な値だけ。翻訳済みの文字列を渡す
- workerd では `handle.signal` を `addEventListener` の `signal` に渡せないので、イベント購読はブラウザでだけ行う
