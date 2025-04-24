import { AwsClient } from 'aws4fetch'

export const createR2Service = (url: string) => {
  let s3Url: URL

  try {
    s3Url = new URL(url)
  } catch (e) {
    throw new Error('Invalid S3 URL')
  }

  const bucket = s3Url.pathname.replace(/^\/+/, '')
  if (bucket === '') {
    throw new Error('Missing bucket name in S3 URL path')
  }

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
    throw new Error('Missing access key or secret key in S3 URL')
  }
  const r2 = new AwsClient({
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretKey,
    region: config.region,
  })

  const generatePresignedUrl = async (
    key: string,
    method: 'GET' | 'PUT',
    expires = 3600,
  ) => {
    const req = await r2.sign(
      new Request(`https://${s3Url.hostname}/${bucket}/${key}`, { method }),
      { aws: { signQuery: true } },
    )
    return req.url
  }

  const uploadUrl = async (key: string, expires = 3600) => {
    return await generatePresignedUrl(key, 'PUT', expires)
  }

  return { generatePresignedUrl, uploadUrl }
}
