import { createAction } from 'remix/router'

import { routes } from '../routes.ts'

export const healthcheck = createAction(routes.healthcheck, async (context) => {
  try {
    let row = await context.bindings.db
      .prepare('SELECT CURRENT_TIMESTAMP AS now')
      .first<{ now: string }>()
    return Response.json(
      { status: 'ok', now: row?.now },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Healthcheck failed:', error)
    return Response.json(
      { status: 'error' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
})
