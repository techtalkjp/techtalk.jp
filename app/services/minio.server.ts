import * as Minio from 'minio'

/**
 *
 * @param url e.g. s3://techtalk:techtalk@127.0.0.1:9000/techtalk?region=auto&useSSL=true
 * @returns
 */
export const createMinioService = (url: string) => {
  const s3Url = new URL(url)

  console.log(s3Url)
  const bucket = s3Url.pathname.replace(/^\/+/, '')
  const config = {
    endPoint: s3Url.hostname,
    port: s3Url.port !== '' ? Number(s3Url.port) : 443,
    useSSL: s3Url.searchParams.get('useSSL') === 'true',
    region: s3Url.searchParams.get('region') ?? undefined,
    accessKey: s3Url.username,
    secretKey: s3Url.password,
    bucket,
  }

  if (!config.accessKey || !config.secretKey) {
    throw new Error('Invalid S3 URL')
  }
  console.log({ config })
  const minioClient = new Minio.Client(config)

  const list = (prefix?: string, recursive?: boolean, startAfter?: string) => {
    return new Promise<Minio.BucketItem[]>((resolve, reject) => {
      const objects: Minio.BucketItem[] = []
      const stream = minioClient.listObjectsV2(
        bucket,
        prefix,
        recursive,
        startAfter,
      )
      stream.on('data', (obj) => objects.push(obj))
      stream.on('error', (err) => reject(err))
      stream.on('end', () => resolve(objects))
    })
  }

  const remove = async (key: string) => {
    return await minioClient.removeObject(bucket, key)
  }

  const generatePresignedUrl = async (
    key: string,
    method: 'GET' | 'PUT',
    expires = 3600,
    metadata: Record<string, string> = {},
  ) => {
    return await minioClient.presignedUrl(
      method,
      bucket,
      key,
      expires,
      metadata,
    )
  }

  const uploadUrl = async (key: string, expires = 3600) => {
    return await generatePresignedUrl(key, 'PUT', expires, {
      'X-Amz-Meta-Status': 'unprocessed',
      'X-Amz-Meta-Upload-Time': new Date().toISOString(),
    })
  }

  return { list, remove, generatePresignedUrl, uploadUrl }
}
