import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: 'app/web-components/fts-search.ts',
      name: 'FtsSearch',
      formats: ['iife'],
      fileName: () => 'fts-search.js',
    },
    outDir: 'public',
    emptyOutDir: false,
    minify: 'esbuild',
  },
})
