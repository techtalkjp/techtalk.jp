import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Readable } from 'node:stream'

const BUKET_NAME = 'techtalk' as const

const client = new S3Client({
  endpoint: process.env.R2_ENDPOINT_URL,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export const ImageEndpointUrl = process.env.IMAGE_ENDPOINT_URL

export const list = async () => {
  const { Contents } = await client.send(
    new ListObjectsV2Command({ Bucket: BUKET_NAME, MaxKeys: 100 }),
  )

  return Contents
}

export const upload = async (file: File) => {
  const { name, type } = file

  const stream = new Readable({ read: () => {} })
  stream.push(Buffer.from(await file.arrayBuffer()))
  stream.push(null)

  const upload = new Upload({
    client,
    params: {
      Body: stream,
      Bucket: BUKET_NAME,
      Key: name,
      ContentType: file.type,
    },
    // 性能改善用の細かなパラメータ
    queueSize: 10, // アップロードの並列数
    partSize: 1024 * 1024 * 5, // 1パート当たりのサイズ
  })

  return await upload.done()
}
