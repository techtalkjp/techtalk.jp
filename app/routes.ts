import type { RouteConfig } from '@react-router/dev/routes'
import { autoRoutes } from 'react-router-auto-routes'

export default autoRoutes({
  ignoredRouteFiles: ['**/_shared/**'],
}) satisfies RouteConfig
