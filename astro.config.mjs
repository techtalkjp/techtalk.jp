import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  experimental: {
    i18n: {
      defaultLocale: 'ja',
      locales: ['ja', 'en'],
    },
  },
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  output: 'hybrid',
  adapter: vercel(),
})
