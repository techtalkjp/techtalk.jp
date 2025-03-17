import type { FilePart, ImagePart } from 'ai'
import { match } from 'ts-pattern'
import { createMinioService } from '~/services/minio.server'

export const prepareFileContents = async (
  files: { key: string; name: string; type: 'image' | 'pdf' }[],
): Promise<Array<ImagePart | FilePart>> => {
  const minio = createMinioService(process.env.TECHTALK_S3_URL)
  const contents: Array<ImagePart | FilePart> = []
  for (const file of files) {
    const url = await minio.generatePresignedUrl(file.key, 'GET')
    const c = match(file.type)
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
    if (c !== null) {
      contents.push(c)
    }
  }
  return contents
}
