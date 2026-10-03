import type { RenderFunction } from 'remix/middleware/render'

import type { Locale } from '../i18n/index.ts'
import { NotFoundPage } from '../ui/simple-page.tsx'

/** どのルートにも一致しないとき、ロケールが不正なときの 404 */
export function notFound(context: {
  url: URL
  render: RenderFunction
}): Response {
  let locale: Locale = context.url.pathname.split('/')[1] === 'en' ? 'en' : 'ja'
  return context.render(<NotFoundPage locale={locale} />, { status: 404 })
}
