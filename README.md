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
pnpm dev                # http://localhost:8787
pnpm validate           # format, lint, typecheck, test
```

Slack の Webhook は `.env`（`.env.example` 参照）に置く。ローカルで問い合わせを送ると Workflow が実際に動くので、Webhook には本番以外の URL を使うこと。

## デプロイ

```sh
pnpm run deploy
pnpm migrations:apply:production
```
