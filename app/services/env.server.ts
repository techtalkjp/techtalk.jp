import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test'] as const),
  SLACK_WEBHOOK: z.string(),
  SENDGRID_API_KEY: z.string(),
  TURSO_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  IMAGE_ENDPOINT_URL: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  TECHTALK_S3_URL: z.string(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env)

  if (parsed.success === false) {
    console.error(
      'Invalid environment variables: ',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }
}
