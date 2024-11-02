import type { RouteConfig } from '@react-router/dev/routes'
import { remixRoutesOptionAdapter } from '@react-router/remix-routes-option-adapter'
import { flatRoutes } from 'remix-flat-routes'

export const routes: RouteConfig = remixRoutesOptionAdapter((defineRotue) =>
  flatRoutes('routes', defineRotue),
)
