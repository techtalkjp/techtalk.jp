import type { LoaderFunctionArgs } from '@remix-run/node'
import path from 'node:path'
import { locales } from '~/features/i18n/utils/detectLocale'
import Index from './_index/route'

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  if (!locales.includes(path.basename(url.pathname)))
    throw new Response('404 Not Found', { status: 404 })
  return {}
}

export default Index
