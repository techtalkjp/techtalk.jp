import { createContextKey, type Middleware } from 'remix/router'

/** ハンドラから使う Cloudflare のバインディング */
export interface Bindings {
  db: D1Database
}

const BindingsKey = createContextKey<Bindings>()

export function bindings(value: Bindings): Middleware<{
  key: typeof BindingsKey
  value: Bindings
  property: 'bindings'
}> {
  return (context, next) => {
    context.set(BindingsKey, value, { property: 'bindings' })
    return next()
  }
}
