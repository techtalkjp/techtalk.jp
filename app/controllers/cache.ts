import { CacheControl } from 'remix/headers'

/**
 * 誰に対しても同じ HTML のページ。ブラウザには毎回確認させ、
 * デプロイ後の HTML と /js/*.js（ハッシュなし）の組み合わせがずれないようにする。
 * Worker が返す HTML は Cloudflare のエッジにはキャッシュされない（Cache API を使えば別）。
 */
export const publicPageHeaders = {
  'Cache-Control': new CacheControl({
    public: true,
    maxAge: 0,
    mustRevalidate: true,
  }).toString(),
}

/** 送信結果など、訪問者ごとに変わる応答 */
export const privateHeaders = {
  'Cache-Control': new CacheControl({
    private: true,
    noStore: true,
  }).toString(),
}
