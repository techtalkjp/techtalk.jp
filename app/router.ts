import { cop } from 'remix/middleware/cop'
import { logger } from 'remix/middleware/logger'
import { render } from 'remix/middleware/render'
import {
  createRouter,
  type Middleware,
  type MiddlewareContext,
} from 'remix/router'

import { biography } from './controllers/biography.tsx'
import { contactForm } from './controllers/contact-form.tsx'
import { healthcheck } from './controllers/healthcheck.ts'
import { home } from './controllers/home.tsx'
import { notFound } from './controllers/not-found.tsx'
import { privacy } from './controllers/privacy.tsx'
import { bindings, type Bindings } from './middleware/bindings.ts'
import { canonicalPath } from './middleware/canonical-path.ts'
import { routes } from './routes.ts'

type AppContext = MiddlewareContext<
  [
    ReturnType<typeof canonicalPath>,
    ReturnType<typeof cop>,
    ReturnType<typeof bindings>,
    ReturnType<typeof render>,
  ]
>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export interface AppRouterOptions {
  bindings: Bindings
  /** テストではログを止める */
  log?: boolean
}

/**
 * アプリのルーターを作る。バインディングは引数で受け取るので、
 * `cloudflare:workers` に依存せずテストできる。
 */
export function createAppRouter(options: AppRouterOptions) {
  let router = createRouter<AppContext>({
    middleware: [
      ...(options.log === false ? [] : [requestLogger()]),
      canonicalPath(),
      cop(),
      bindings(options.bindings),
      render({ onError: (error) => console.error(error) }),
    ],
    defaultHandler: (context) => notFound(context),
  })

  router.map(routes.home, home)
  router.map(routes.biography, biography)
  router.map(routes.privacy, privacy)
  router.map(routes.contactForm, contactForm)
  router.map(routes.healthcheck, healthcheck)

  return router
}

/**
 * リクエストログ。ページの描画中にサーバー内で解決する Frame の GET は、ページ本体と
 * 二重に数えないよう記録しない。X-Remix-Top-Frame-Src は render ミドルウェアが
 * サーバー内のサブリクエストに付けるヘッダー。誰でも付けられるので、外すのは GET だけにして
 * 送信（POST）は必ず記録する。
 */
function requestLogger(): Middleware {
  let log = logger()
  return (context, next) => {
    let isInternalFrame =
      context.request.method === 'GET' &&
      context.request.headers.has('X-Remix-Top-Frame-Src')
    return isInternalFrame ? next() : log(context, next)
  }
}
