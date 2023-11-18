import type { LoaderFunctionArgs } from '@vercel/remix'
import path from 'path'
import { locales } from '~/features/i18n/utils/detectLocale'
import Index from './_index/route'

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  if (!locales.includes(path.basename(url.pathname))) throw new Response('Not Found', { status: 404 })
  return {}
}

export default Index
