# techtalk.jp

株式会社TechTalk のコーポレートサイト（https://www.techtalk.jp）。

## 構成

- [Remix 3](https://remix.run)（`remix/component` によるサーバー描画、アイランド、Frame）
- Cloudflare Workers / D1 / Workers AI / Workflows / Email
- ページ: トップ（`/`, `/en`）、経歴（`/biography`, `/en/biography`）、プライバシーポリシー（`/privacy`）
- 問い合わせは `ContactWorkflow` で非同期に処理する（Workers AI で営業判定し、Slack とメールで通知）
- サイトの前提（誰に何を伝えるか、出してよい実績）は `PRODUCT.md`、見た目の決まりは `DESIGN.md`

## 開発

```sh
pnpm install
pnpm migrations:apply   # ローカル D1
pnpm dev                # https://techtalk.localhost
pnpm validate           # fonts:ensure のあと format, lint, typecheck, test, fonts:check
```

[Portless](https://github.com/vercel-labs/portless) がプロキシを起動し、空いているポートで Wrangler を動かす。初回は HTTPS 証明書の信頼登録と、443 番ポートを使うための管理者認証が求められる。Git worktree では URL に worktree 名が付くので、起動時に表示される URL を使う。

管理者権限なしでプロキシを起動する場合は `PORTLESS_PORT=1355 PORTLESS_HTTPS=0 pnpm dev`（`http://techtalk.localhost:1355`）。Portless を使わずに起動する場合は `PORTLESS=0 pnpm dev`（`http://localhost:8787`）。

Slack の Webhook は `.env`（`.env.example` 参照）に置く。ローカルで問い合わせを送ると Workflow が実際に動くので、Webhook には本番以外の URL を使うこと。

### フォント

LINE Seed JP はサイト内で使う文字に絞った WOFF2 を `public/fonts/` から配信する。400・700 は `app/` のソースと英訳に含まれる文字、800 はワードマークの `TechTalk` のみを収録する。収録外の文字（問い合わせ欄に入力された文字など）は OS のフォントで表示する。通常の横書きに必要な字形・カーニング・合字を残し、未使用の縦書き・旧字体・全角英数などの代替字形は除く。縦書きや `font-feature-settings` を導入するときは生成スクリプトの収録機能も見直す。

本文の 400・700 は `<head>` で preload する。読み込む URL は生成スクリプトが `app/ui/fonts.ts` の `fontPreloads` に書き出す。

`pnpm dev`（変更の監視中も含む）・`pnpm build`・`pnpm validate`・デプロイ時に、ソースが変わっていれば自動で再生成する。再生成には [uv](https://docs.astral.sh/uv/) が必要。変更がなければ uv を起動せず、生成済みファイルを使う。生成物もコミットする。手動で作り直す場合は `pnpm fonts:build`。生成元のバージョンとライセンスは `scripts/build-fonts.py` と `public/fonts/OFL.txt` に記録している。

## デプロイ

main にマージすると、Cloudflare の Workers Builds が本番にデプロイする。結果は GitHub のチェック（`Workers Builds: techtalkjp`）に出る。手元から出し直すときは `pnpm run deploy`。

D1 のマイグレーションは自動では当たらないので、手で `pnpm migrations:apply:production` を実行する。どちらを先にするかは中身で決める。テーブルや列を足すときは、新しいコードが書き込む先を先に用意するため、マージの前にマイグレーションを当てる。消すときは、古いコードが動いている間に消さないよう、マージしてデプロイが終わってから当てる。
