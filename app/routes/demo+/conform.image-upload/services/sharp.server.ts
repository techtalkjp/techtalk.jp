import { default as Sharp } from 'sharp'

// sharp で画像をリサイズ・圧縮する
export const resizeImage = async (
  buffer: Buffer,
  width: number,
  height: number,
) => {
  return await Sharp(buffer)
    .resize(width, height)
    .webp({ quality: 80 })
    .toBuffer()
}
