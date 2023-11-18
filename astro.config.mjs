import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  experimental: {
    i18n: {
      defaultLocale: "ja",
      locales: ["ja", "en"],
    },
  },
  integrations: [tailwind({ applyBaseStyles: false }), react()],
});
