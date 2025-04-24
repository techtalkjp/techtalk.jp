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
    metadata: Record<string, string> = {},
  ) => {
    const req = await r2.sign(
      new Request(`https://${bucket}.${s3Url.hostname}/${key}`, {
        method,
        headers: {
          'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
          'x-amz-date': new Date().toISOString(),
          'x-amz-meta-status': metadata['X-Amz-Meta-Status'] || 'unprocessed',
          'x-amz-meta-upload-time':
            metadata['X-Amz-Meta-Upload-Time'] || new Date().toISOString(),
          ...metadata,
        },
      }),
    )
    return req.url
  }

  const uploadUrl = async (key: string, expires = 3600) => {
    return await generatePresignedUrl(key, 'PUT', expires, {
      'X-Amz-Meta-Status': 'unprocessed',
      'X-Amz-Meta-Upload-Time': new Date().toISOString(),
    })
  }

  return { generatePresignedUrl, uploadUrl }
}
