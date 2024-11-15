import path from 'node:path'
import { locales } from '~/i18n/utils/detectLocale'
import type { Route } from './+types.$'
import Index from './_index/route'

export const loader = ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url)
  if (!locales.includes(path.basename(url.pathname)))
    throw new Response('404 Not Found', { status: 404 })
  return {}
}

export default Index
