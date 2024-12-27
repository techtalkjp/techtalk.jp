import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  prerender: ['/', '/en', '/privacy'],
  serverBuildFile: 'index.js',
} satisfies Config
