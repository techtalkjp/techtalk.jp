import { createAction } from 'remix/router'

import { locale } from '../middleware/locale.ts'
import { routes } from '../routes.ts'
import { BiographyPage } from '../ui/biography/page.tsx'
import { publicPageHeaders } from './cache.ts'

export const biography = createAction(routes.biography, {
  middleware: [locale()],
  handler: (context) =>
    context.render(<BiographyPage i18n={context.i18n} />, {
      headers: publicPageHeaders,
    }),
})
