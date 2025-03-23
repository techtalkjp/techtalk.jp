import type { FilePart, ImagePart } from 'ai'
import { match } from 'ts-pattern'
import { createMinioService } from '~/services/minio.server'

export const prepareFileContents = async (file: {
  prefix: string
  key: string
  name: string
  type: 'image' | 'pdf'
}): Promise<ImagePart | FilePart | null> => {
  const minio = createMinioService(process.env.TECHTALK_S3_URL)

  const url = await minio.generatePresignedUrl(
    `${file.prefix}/${file.key}`,
    'GET',
  )
  const content = match(file.type)
    .when(
      (t) => t === 'pdf',
      () =>
        ({
          type: 'file',
          data: url,
          mimeType: 'application/pdf',
        }) satisfies FilePart,
    )
    .when(
      (t) => t === 'image',
      () =>
        ({
          type: 'image',
          image: url,
        }) satisfies ImagePart,
    )
    .otherwise((t) => {
      return null
    })

  return content
}
