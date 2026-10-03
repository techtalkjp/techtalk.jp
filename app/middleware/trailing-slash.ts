import { createRedirectResponse } from 'remix/response/redirect'
import type { Middleware } from 'remix/router'

/** `/en/` のような末尾スラッシュ付きの URL を、スラッシュなしへ恒久リダイレクトする */
export function trailingSlash(): Middleware {
  return (context, next) => {
    let { pathname, search } = context.url
    if (pathname.length > 1 && pathname.endsWith('/')) {
      let location = pathname.replace(/\/+$/, '') || '/'
      return createRedirectResponse(location + search, 301)
    }
    return next()
  }
}
