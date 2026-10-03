import { CacheControl } from 'remix/headers'

/**
 * GET のページは誰に対しても同じ HTML なので、エッジでキャッシュしてよい。
 * ブラウザには毎回確認させ、デプロイ後の反映を遅らせない。
 */
export const publicPageHeaders = {
  'Cache-Control': new CacheControl({
    public: true,
    maxAge: 0,
    sMaxage: 600,
    staleWhileRevalidate: 86400,
  }).toString(),
}
