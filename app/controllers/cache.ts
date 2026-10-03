import { CacheControl } from 'remix/headers'

/**
 * GET のページは誰に対しても同じ HTML なので、エッジ（Cloudflare）ではキャッシュしてよい。
 * ブラウザには毎回確認させ、デプロイ後の HTML と /js/*.js の組み合わせがずれないようにする。
 */
export const publicPageHeaders = {
  'Cache-Control': new CacheControl({
    public: true,
    maxAge: 0,
    mustRevalidate: true,
  }).toString(),
  'Cloudflare-CDN-Cache-Control': new CacheControl({
    maxAge: 600,
    staleWhileRevalidate: 86400,
  }).toString(),
}
