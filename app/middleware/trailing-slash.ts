import { createRedirectResponse } from 'remix/response/redirect'
import type { Middleware } from 'remix/router'

/**
 * `/en/` のような末尾スラッシュ付きの URL を、スラッシュなしへ恒久リダイレクトする。
 * `//evil.com/` が `Location: //evil.com`（別サイト）にならないよう、
 * 連続するスラッシュをまとめ、同じオリジンの絶対 URL で返す。
 */
export function trailingSlash(): Middleware {
  return (context, next) => {
    let { pathname } = context.url
    if (pathname.length > 1 && pathname.endsWith('/')) {
      let location = new URL(context.url)
      location.pathname =
        pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/'
      return createRedirectResponse(location, 301)
    }
    return next()
  }
}
