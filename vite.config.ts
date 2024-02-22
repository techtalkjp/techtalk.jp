import mdx from '@mdx-js/rollup'
import { vitePlugin as remix } from '@remix-run/dev'
import { vercelPreset } from '@vercel/remix/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    mdx(),
    remix({
      ignoredRouteFiles: ['**/.*'],
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
  ],
})
