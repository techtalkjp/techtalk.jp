import mdx from '@mdx-js/rollup'
import { vitePlugin as remix } from '@remix-run/dev'
import { vercelPreset } from '@vercel/remix/vite'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

declare module '@remix-run/server-runtime' {
  interface Future {
    unstable_singleFetch: true
  }
}

export default defineConfig({
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    process.env.VITEST
      ? react()
      : remix({
          ignoredRouteFiles: ['**/.*'],
          routes: (defineRoutes) =>
            flatRoutes('routes', defineRoutes, {
              ignoredRouteFiles: ['**/index.ts'],
            }),
          presets: [vercelPreset()],
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
            unstable_singleFetch: true,
            unstable_lazyRouteDiscovery: true,
            unstable_optimizeDeps: true,
          },
        }),
    tsconfigPaths(),
  ],
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'] },
})
