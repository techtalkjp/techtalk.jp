import { default as Sharp } from 'sharp'

// sharp で画像をリサイズ・圧縮する
export const resizeImage = async (
  file: File,
  { width, height }: { width: number; height?: number },
) => {
  const filename = file.name.replace(/\.\w+$/, '.webp')
  const resizedBuffer = await Sharp(Buffer.from(await file.arrayBuffer()))
    .resize(width, height)
    .webp({ quality: 80 })
    .toBuffer()
  return await new File([resizedBuffer], filename, { type: 'image/webp' })
}
