import type { FilePart, ImagePart } from 'ai'
import { match } from 'ts-pattern'
import { r2 } from '~/services/r2.server'

export const prepareFileContents = async (file: {
  prefix: string
  key: string
  name: string
  type: 'image' | 'pdf'
}): Promise<ImagePart | FilePart | null> => {
  const url = await r2.downloadUrl(`${file.prefix}/${file.key}`)
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
    .otherwise(() => {
      return null
    })

  return content
}
