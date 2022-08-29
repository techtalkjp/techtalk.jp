import path from 'path'
import type { LoaderArgs } from '@remix-run/node'
import { locales } from '~/features/i18n/utils/detectLocale'
import Index from './index'

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  if (!locales.includes(path.basename(url.pathname)))
    throw new Response('Not Found', { status: 404 })
  return {}
}

export default Index
