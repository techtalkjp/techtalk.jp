import type { PlatformProxy } from 'wrangler'
import { getDb } from './app/services/db.server'

type GetLoadContextArgs = {
  request: Request
  context: {
    cloudflare: Omit<
      PlatformProxy<Env, IncomingRequestCfProperties>,
      'dispose' | 'caches'
    > & {
      caches:
        | PlatformProxy<Env, IncomingRequestCfProperties>['caches']
        | CacheStorage
    }
  }
}

declare module 'react-router' {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // This will merge the result of `getLoadContext` into the `AppLoadContext`
  }
}

export function getLoadContext({ context }: GetLoadContextArgs) {
  return {
    ...context,
    db: getDb({
      url: context.cloudflare.env.TURSO_URL,
      authToken: context.cloudflare.env.TURSO_AUTH_TOKEN,
    }),
  }
}
