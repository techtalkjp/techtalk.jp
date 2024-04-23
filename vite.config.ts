import mdx from '@mdx-js/rollup'
import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { vercelPreset } from '@vercel/remix/vite'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    !process.env.VITEST
      ? remix({
          ignoredRouteFiles: ['**/.*'],
          routes: (defineRoutes) => flatRoutes('routes', defineRoutes),
          presets: [vercelPreset()],
        })
      : react(),
    tsconfigPaths(),
  ],
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'] },
})
