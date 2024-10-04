import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import { vercelPreset } from '@vercel/remix/vite'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    process.env.VITEST
      ? react()
      : reactRouter({
          presets: [vercelPreset()],
        }),
    tsconfigPaths(),
  ],
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'] },
})
