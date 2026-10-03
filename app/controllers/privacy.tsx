import { createAction } from 'remix/router'

import { routes } from '../routes.ts'
import { PrivacyPage } from '../ui/simple-page.tsx'
import { publicPageHeaders } from './cache.ts'

export const privacy = createAction(routes.privacy, (context) =>
  context.render(<PrivacyPage />, { headers: publicPageHeaders }),
)
