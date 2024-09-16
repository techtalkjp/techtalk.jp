import { Client, type BucketItem } from 'minio'
import { Readable } from 'node:stream'

const BUCKET_NAME = 'techtalk' as const

const client = new Client({
  endPoint: process.env.R2_ENDPOINT_URL,
  accessKey: process.env.R2_ACCESS_KEY_ID,
  secretKey: process.env.R2_SECRET_ACCESS_KEY,
  useSSL: true,
  region: 'auto',
})

export const ImageEndpointUrl = process.env.IMAGE_ENDPOINT_URL

export const list = async () => {
  const objectsList = await new Promise<BucketItem[]>((resolve, reject) => {
    const objectsListTemp: BucketItem[] = []
    const stream = client.listObjectsV2(BUCKET_NAME, '', true, '')

    stream.on('data', (obj) => obj.name && objectsListTemp.push({ ...obj }))
    stream.on('error', reject)
    stream.on('end', () => {
      resolve(objectsListTemp)
    })
  })
  return objectsList
}

export const upload = async (file: File) => {
  const { name, type } = file

  const stream = new Readable({ read: () => {} })
  stream.push(Buffer.from(await file.arrayBuffer()))
  stream.push(null)

  return await client.putObject(BUCKET_NAME, name, stream, file.size, {
    'Content-Type': type,
  })
}

export const createPresignedUrl = async (key: string) => {
  return await client.presignedUrl('GET', BUCKET_NAME, key, 60 * 60)
}
