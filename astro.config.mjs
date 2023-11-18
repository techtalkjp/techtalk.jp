import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  experimental: {
    i18n: {
      defaultLocale: "ja",
      locales: ["ja", "en"],
    },
  },
  output: "server",
  adapter: cloudflare(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
});
