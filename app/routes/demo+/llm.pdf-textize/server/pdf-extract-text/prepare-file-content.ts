import type { FilePart, ImagePart } from 'ai'
import { match } from 'ts-pattern'

export const prepareFileContents = async (
  file: File,
): Promise<ImagePart | FilePart | null> => {
  const arrayBuffer = await file.arrayBuffer()
  // Web Streams API を使用して効率的にBASE64エンコード
  const base64 = Buffer.from(arrayBuffer).toString('base64')

  console.log('File type:', file.type)

  const content = match(file.type)
    .when(
      (t) => t === 'application/pdf',
      () =>
        ({
          type: 'file',
          data: base64,
          mediaType: 'application/pdf',
        }) satisfies FilePart,
    )
    .when(
      (t) => t === 'image/png' || t === 'image/jpeg',
      () =>
        ({
          type: 'image',
          image: base64,
        }) satisfies ImagePart,
    )
    .otherwise(() => {
      return null
    })

  return content
}
