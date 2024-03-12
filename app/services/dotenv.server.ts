import { z } from 'zod'

const envSchema = z.object({
  SLACK_WEBHOOK: z.string(),
  SENDGRID_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  TURSO_USE_EMBEDDED_REPLICA: z.string(),
})
envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
