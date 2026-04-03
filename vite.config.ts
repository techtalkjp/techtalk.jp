import { cloudflare } from '@cloudflare/vite-plugin'
import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    reactRouter(),
    devtoolsJson(),
    visualizer(),
  ],
})
