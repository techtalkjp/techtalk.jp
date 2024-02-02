import { z } from 'zod'

const envSchema = z.object({
  SLACK_WEBHOOK: z.string(),
  SENDGRID_API_KEY: z.string(),
})

envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
