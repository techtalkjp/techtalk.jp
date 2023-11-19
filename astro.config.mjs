import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

export default defineConfig({
  experimental: {
    i18n: {
      defaultLocale: 'ja',
      locales: ['ja', 'en'],
    },
  },
  integrations: [tailwind({ applyBaseStyles: false })],
})
