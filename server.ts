import { createRequestHandler, type ServerBuild } from 'react-router'
// @ts-ignore This file won’t exist if it hasn’t yet been built
import * as build from './build/server'
import { getLoadContext } from './load-context'
import { queue } from './workers/queue'

const requestHandler = createRequestHandler(build as unknown as ServerBuild)

export default {
  async fetch(request, env, ctx) {
    const loadContext = getLoadContext({
      request,
      context: {
        cloudflare: {
          // This object matches the return value from Wrangler's
          // `getPlatformProxy` used during development via Remix's
          // `cloudflareDevProxyVitePlugin`:
          // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
          // @ts-ignore
          cf: request.cf,
          ctx: {
            waitUntil: ctx.waitUntil.bind(ctx),
            passThroughOnException: ctx.passThroughOnException.bind(ctx),
          },
          caches,
          env,
        },
      },
    })

    return await requestHandler(request, loadContext)
  },
  queue,
} satisfies ExportedHandler<Env>
