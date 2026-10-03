import type { RenderFunction } from 'remix/middleware/render'
import { createContextKey, type Middleware } from 'remix/router'

import { notFound } from '../controllers/not-found.tsx'
import { createI18n, parseLocale, type I18n } from '../i18n/index.ts'

const I18nKey = createContextKey<I18n>()

/**
 * `(:lang)` を持つルートに付けるミドルウェア。未対応のロケールは 404 にし、
 * 対応していればリクエスト用の翻訳関数を `context.i18n` に置く。
 */
export function locale(): Middleware<{
  key: typeof I18nKey
  value: I18n
  property: 'i18n'
}> {
  return (context, next) => {
    let { lang } = context.params as { lang?: string }
    let parsed = parseLocale(lang)
    // render ミドルウェアはルーター全体に掛けてあるので、ここでも使える
    if (!parsed)
      return notFound(context as typeof context & { render: RenderFunction })
    context.set(I18nKey, createI18n(parsed), { property: 'i18n' })
    return next()
  }
}
