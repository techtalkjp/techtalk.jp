import { z } from 'zod'
import { r2 } from '~/services/r2.server'
import type { Route } from './+types/route'

const schema = z.object({
  names: z.array(z.string()),
  prefix: z.string().optional(),
})

export async function action({ request }: Route.ActionArgs) {
  const { names, prefix } = schema.parse(await request.json())
  const id = crypto.randomUUID()

  // アップロード用のURLを生成
  const uploadUrls = await Promise.all(
    names.map(async (name) => {
      const key = `${id}-${name}`
      const urlPath = prefix ? `${prefix}/${key}` : key
      const signedUrl = await r2.uploadUrl(urlPath)

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
