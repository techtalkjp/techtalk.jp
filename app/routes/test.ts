import type { LoaderFunctionArgs } from 'react-router'

export const loader = ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL('/images/about.webp', request.url)
  if (context?.cloudflare.env.ASSETS) {
    return context.cloudflare.env.ASSETS.fetch(url.toString())
  }
  return fetch(url.toString())
}
