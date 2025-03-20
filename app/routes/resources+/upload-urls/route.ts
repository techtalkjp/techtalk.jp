import { z } from 'zod'
import { createMinioService } from '~/services/minio.server'
import type { Route } from './+types/route'

const schema = z.object({
  fileNames: z.array(z.string()),
  prefix: z.string().optional().default('uploads'),
})

export async function action({ request, context }: Route.ActionArgs) {
  const { fileNames, prefix } = schema.parse(await request.json())
  const { uploadUrl } = createMinioService(process.env.TECHTALK_S3_URL)
  const id = crypto.randomUUID()

  // アップロード用のURLを生成
  const uploadUrls = await Promise.all(
    fileNames.map(async (fileName) => {
      const fileKey = `${prefix}/${id}-${fileName}`
      const signedUrl = await uploadUrl(fileKey)

      return {
        fileName,
        uploadUrl: signedUrl,
        fileKey,
      }
    }),
  )

  return { id, uploadUrls }
}
