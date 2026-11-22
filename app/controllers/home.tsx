import { createAction } from 'remix/router'

import { locale } from '../middleware/locale.ts'
import { routes } from '../routes.ts'
import { HomePage } from '../ui/home/page.tsx'
import { publicPageHeaders } from './cache.ts'

export const home = createAction(routes.home, {
  middleware: [locale()],
  handler: (context) =>
    context.render(<HomePage i18n={context.i18n} />, {
      headers: publicPageHeaders,
    }),
})
