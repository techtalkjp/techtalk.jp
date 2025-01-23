import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { sessionContextPlugin } from 'session-context/vite'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getLoadContext } from './load-context'

export default defineConfig({
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    !process.env.VITEST && cloudflareDevProxy({ getLoadContext }),
    process.env.VITEST ? react() : reactRouter(),
    sessionContextPlugin(),
    tsconfigPaths(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  ssr: {
    optimizeDeps: {
      include: [
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom',
        'react-dom/server',
        'react-router',
      ],
    },
  },
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'] },
})
