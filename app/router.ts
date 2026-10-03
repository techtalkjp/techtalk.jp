import { cop } from 'remix/middleware/cop'
import { formData } from 'remix/middleware/form-data'
import { logger } from 'remix/middleware/logger'
import { render } from 'remix/middleware/render'
import { createRouter, type MiddlewareContext } from 'remix/router'

import { biography } from './controllers/biography.tsx'
import { contactForm } from './controllers/contact-form.tsx'
import { healthcheck } from './controllers/healthcheck.ts'
import { home } from './controllers/home.tsx'
import { notFound } from './controllers/not-found.tsx'
import { privacy } from './controllers/privacy.tsx'
import { bindings, type Bindings } from './middleware/bindings.ts'
import { trailingSlash } from './middleware/trailing-slash.ts'
import { routes } from './routes.ts'

type AppContext = MiddlewareContext<
  [
    ReturnType<typeof trailingSlash>,
    ReturnType<typeof cop>,
    ReturnType<typeof formData>,
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
      ...(options.log === false ? [] : [logger()]),
      trailingSlash(),
      cop(),
      formData(),
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
