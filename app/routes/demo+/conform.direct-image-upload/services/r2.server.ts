import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

export const createPresignedUrl = async (key: string) => {
  return await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: BUKET_NAME,
      Key: key,
    }),
    { expiresIn: 60 * 60 },
  )
}
