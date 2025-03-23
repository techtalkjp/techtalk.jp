import { z } from 'zod'
import { createMinioService } from '~/services/minio.server'
import type { Route } from './+types/route'

const schema = z.object({
  names: z.array(z.string()),
  prefix: z.string().optional(),
})

export async function action({ request }: Route.ActionArgs) {
  const { names, prefix } = schema.parse(await request.json())
  const { uploadUrl } = createMinioService(process.env.TECHTALK_S3_URL)
  const id = crypto.randomUUID()

  // アップロード用のURLを生成
  const uploadUrls = await Promise.all(
    names.map(async (name) => {
      const key = `${id}-${name}`
      const signedUrl = await uploadUrl(`${prefix}/${key}`)

      return {
        prefix,
        name,
        uploadUrl: signedUrl,
        key,
      }
    }),
  )

  return { id, uploadUrls }
}
