import type { RenderFunction } from 'remix/middleware/render'

import { parseLocale } from '../i18n/index.ts'
import { NotFoundPage } from '../ui/simple-page.tsx'

/** どのルートにも一致しないとき、ロケールが不正なときの 404 */
export function notFound(context: {
  url: URL
  render: RenderFunction
}): Response {
  let firstSegment = context.url.pathname.split('/')[1]
  let locale = parseLocale(firstSegment === 'en' ? 'en' : undefined) ?? 'ja'
  return context.render(<NotFoundPage locale={locale} />, { status: 404 })
}
