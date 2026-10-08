# techtalk.jp

株式会社TechTalk のコーポレートサイト（https://www.techtalk.jp）。

## 構成

- [Remix 3](https://remix.run)（`remix/component` によるサーバー描画、アイランド、Frame）
- Cloudflare Workers / D1 / Workers AI / Workflows / Email
- ページ: トップ（`/`, `/en`）、経歴（`/biography`, `/en/biography`）、プライバシーポリシー（`/privacy`）
- 問い合わせは `ContactWorkflow` で非同期に処理する（Workers AI で営業判定し、Slack とメールで通知）

## 開発

```sh
pnpm install
pnpm migrations:apply   # ローカル D1
pnpm dev                # https://techtalk.localhost
pnpm validate           # format, lint, typecheck, test
```

[Portless](https://github.com/vercel-labs/portless) がプロキシを起動し、空いているポートで Wrangler を動かす。初回は HTTPS 証明書の信頼登録と、443 番ポートを使うための管理者認証が求められる。Git worktree では URL に worktree 名が付くので、起動時に表示される URL を使う。

管理者権限なしでプロキシを起動する場合は `PORTLESS_PORT=1355 PORTLESS_HTTPS=0 pnpm dev`（`http://techtalk.localhost:1355`）。Portless を使わずに起動する場合は `PORTLESS=0 pnpm dev`（`http://localhost:8787`）。

Slack の Webhook は `.env`（`.env.example` 参照）に置く。ローカルで問い合わせを送ると Workflow が実際に動くので、Webhook には本番以外の URL を使うこと。

### フォント

LINE Seed JP はサイト内で使う文字に絞った WOFF2 を `public/fonts/` から配信する。400・700 は `app/` のソースと英訳に含まれる文字、800 はワードマークの `TechTalk` のみを収録する。収録外の文字（問い合わせ欄に入力された文字など）は OS のフォントで表示する。

`pnpm dev`（変更の監視中も含む）・`pnpm build`・`pnpm validate`・デプロイ時に、ソースが変わっていれば自動で再生成する。再生成には [uv](https://docs.astral.sh/uv/) が必要。変更がなければ uv を起動せず、生成済みファイルを使う。生成物もコミットする。手動で作り直す場合は `pnpm fonts:build`。生成元のバージョンとライセンスは `scripts/build-fonts.py` と `public/fonts/OFL.txt` に記録している。

## デプロイ

```sh
pnpm run deploy
pnpm migrations:apply:production
```
