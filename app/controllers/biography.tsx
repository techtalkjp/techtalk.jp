import { createAction } from 'remix/router'

import { createI18n, parseLocale } from '../i18n/index.ts'
import { routes } from '../routes.ts'
import { BiographyPage } from '../ui/biography/page.tsx'
import { publicPageHeaders } from './cache.ts'
import { notFound } from './not-found.tsx'

export const biography = createAction(routes.biography, (context) => {
  let locale = parseLocale(context.params.lang)
  if (!locale) return notFound(context)
  return context.render(<BiographyPage i18n={createI18n(locale)} />, {
    headers: publicPageHeaders,
  })
})
