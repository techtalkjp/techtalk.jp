import { createRedirectResponse } from 'remix/response/redirect'
import type { Middleware } from 'remix/router'

/**
 * URL のパスを正規形にそろえ、違っていれば 1 回の 301 で寄せる。
 * - 連続するスラッシュをまとめる（`//evil.com/` が別サイトへのリダイレクトにならないよう、
 *   同じオリジンの絶対 URL で返す）
 * - 末尾のスラッシュを外す（`/en/` → `/en`）
 * - 旧サイトの `/ja` 接頭辞を外す（ja は接頭辞なしが正）
 */
export function canonicalPath(): Middleware {
  return (context, next) => {
    let { pathname } = context.url
    let canonical =
      pathname
        .replace(/\/{2,}/g, '/')
        .replace(/^\/ja(?=\/|$)/, '')
        .replace(/\/+$/, '') || '/'
    if (canonical !== pathname) {
      let location = new URL(context.url)
      location.pathname = canonical
      return createRedirectResponse(location, 301)
    }
    return next()
  }
}
