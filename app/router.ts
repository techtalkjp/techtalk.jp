import { cop } from 'remix/middleware/cop'
import { logger } from 'remix/middleware/logger'
import { render } from 'remix/middleware/render'
import { createRouter, type MiddlewareContext } from 'remix/router'

import { biography } from './controllers/biography.tsx'
import { home } from './controllers/home.tsx'
import { notFound } from './controllers/not-found.tsx'
import { privacy } from './controllers/privacy.tsx'
import { canonicalPath } from './middleware/canonical-path.ts'
import { routes } from './routes.ts'

type AppContext = MiddlewareContext<
  [
    ReturnType<typeof canonicalPath>,
    ReturnType<typeof cop>,
    ReturnType<typeof render>,
  ]
>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export interface AppRouterOptions {
  /** テストではログを止める */
  log?: boolean
}

/** アプリのルーターを作る */
export function createAppRouter(options: AppRouterOptions = {}) {
  let router = createRouter<AppContext>({
    middleware: [
      ...(options.log === false ? [] : [logger()]),
      canonicalPath(),
      cop(),
      render({ onError: (error) => console.error(error) }),
    ],
    defaultHandler: (context) => notFound(context),
  })

  router.map(routes.home, home)
  router.map(routes.biography, biography)
  router.map(routes.privacy, privacy)

  return router
}
