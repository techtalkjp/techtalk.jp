import { createContextKey, type Middleware } from 'remix/router'

import type { ContactInquiry } from '../contact/types.ts'

/** ハンドラから使う Cloudflare のバインディング */
export interface Bindings {
  db: D1Database
  contactWorkflow: Pick<Workflow<ContactInquiry>, 'create'>
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
