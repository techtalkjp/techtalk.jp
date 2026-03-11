import { env } from 'cloudflare:workers'
import type { Route } from './+types/image.$'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const key = params['*']
  if (!key?.startsWith('uploads/')) {
    return new Response(null, { status: 404 })
  }

  const object = await env.R2.get(key)
  if (!object) {
    return new Response(null, { status: 404 })
  }

  return new Response(object.body, {
    headers: {
      'Content-Type':
        object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
