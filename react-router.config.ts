import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  splitRouteModules: true,
  future: {
    unstable_optimizeDeps: true,
  },
} satisfies Config
