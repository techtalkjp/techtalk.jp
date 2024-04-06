import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'

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
    new ListObjectsV2Command({ Bucket: BUKET_NAME }),
  )

  return Contents
}
