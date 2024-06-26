import { z } from 'zod'

const envSchema = z.object({
  SLACK_WEBHOOK: z.string(),
  SENDGRID_API_KEY: z.string(),
  TURSO_URL: z.string(),
  TURSO_SYNC_URL: z.string().optional(),
  TURSO_AUTH_TOKEN: z.string(),
  IMAGE_ENDPOINT_URL: z.string().url(),
  R2_ENDPOINT_URL: z.string().url(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
})
envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
