import type * as Route from './+types.test'

export const loader = ({ request, context }: Route.LoaderArgs) => {
  const url = new URL('/images/about.webp', request.url)
  if (context?.cloudflare.env.ASSETS) {
    return context.cloudflare.env.ASSETS.fetch(url.toString())
  }
  return fetch(url.toString())
}
