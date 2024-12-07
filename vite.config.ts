import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { sessionContextPlugin } from 'session-context/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getLoadContext } from './load-context'

export default defineConfig({
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    cloudflareDevProxy({ getLoadContext }),
    process.env.VITEST ? react() : reactRouter(),
    sessionContextPlugin(),
    tsconfigPaths(),
  ],
  // @ts-ignore
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'] },
})
