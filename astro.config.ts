import { envField as e, defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

export default defineConfig({
  adapter: vercel(),
  output: "server",
  env: {
    validateSecrets: true,
    schema: {
      DISCORD_WEBHOOK_URL: e.string({
        context: "server",
        access: "secret",
      }),
      R2_ACCOUNT_ID: e.string({
        context: "server",
        access: "public",
      }),
      R2_ACCESS_KEY_ID: e.string({
        context: "server",
        access: "secret",
      }),
      R2_SECRET_ACCESS_KEY: e.string({
        context: "server",
        access: "secret",
      }),
      R2_BUCKET_NAME: e.string({
        context: "server",
        access: "public",
      }),
      R2_PUBLIC_URL: e.string({
        context: "server",
        access: "public",
      }),
    },
  },
});
