import { getSessionContext, setProcessEnv } from 'session-context'
import type { PlatformProxy } from 'wrangler'

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
  interface LoaderFunctionArgs {
    context: AppLoadContext
  }

  interface ActionFunctionArgs {
    context: AppLoadContext
  }
}

export function getLoadContext({ context }: GetLoadContextArgs) {
  const store = getSessionContext()
  store.env = context.cloudflare.env
  setProcessEnv(context.cloudflare.env)
  return context
}
