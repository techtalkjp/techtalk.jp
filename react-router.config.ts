import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
    v8_splitRouteModules: true,
    v8_middleware: true,
    unstable_optimizeDeps: true,
  },
} satisfies Config
