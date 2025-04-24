import { AwsClient } from 'aws4fetch'
import { env } from 'cloudflare:workers'

let _r2: AwsClient | null = null
let _bucket: string | null = null
let _hostname: string | null = null
let _initialized = false
let _initError: Error | null = null

try {
  // 環境変数から設定を読み込み (モジュールロード時に一度だけ実行される)
  const s3Url = new URL(env.TECHTALK_S3_URL) // Worker起動時に env が利用可能である前提
  const bucketName = s3Url.pathname.replace(/^\/+/, '')
  if (bucketName === '') {
    throw new Error('Missing bucket name in S3 URL path')
  }

  const accessKey = s3Url.username
  const secretKey = s3Url.password
  const region = s3Url.searchParams.get('region') ?? undefined // R2 は通常 'auto' または未指定で良い

  if (!accessKey || !secretKey) {
    throw new Error('Missing access key or secret key in S3 URL')
  }

  _hostname = s3Url.hostname
  _bucket = bucketName
  _r2 = new AwsClient({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: region, // R2 は 'auto' を推奨
    service: 's3', // 明示的に s3 を指定
  })

  _initialized = true
  console.log('R2 Service initialized successfully.') // 初期化成功ログ (デバッグ用)
} catch (e) {
  _initError =
    e instanceof Error
      ? e
      : new Error('Unknown error during R2 service initialization')
  console.error('Failed to initialize R2 service:', _initError)
  // 初期化失敗。関数呼び出し時にエラーをスローするようにする。
}

// --- エクスポートする関数 ---

/**
 * R2 サービスが正しく初期化されているか確認し、
 * 初期化されていなければエラーをスローする
 */
function ensureInitialized(): void {
  if (!_initialized || !_r2 || !_hostname || !_bucket) {
    throw new Error(
      `R2 service failed to initialize${_initError ? `: ${_initError.message}` : '.'}`,
    )
  }
}

/**
 * Presigned URL を生成する (PUT または GET)
 * デフォルトで15分間有効
 * @param key オブジェクトキー (例: 'uploads/tmp/image.png')
 * @param method 'GET' または 'PUT'
 * @returns Presigned URL 文字列
 * @throws Error R2 サービスの初期化に失敗した場合
 */
async function generatePresignedUrl(
  key: string,
  method: 'GET' | 'PUT',
): Promise<string> {
  ensureInitialized() // 初期化チェック
  const req = await _r2!.sign(
    // Non-null assertion operator (!) - ensureInitialized でチェック済みのため
    new Request(`https://${_hostname}/${_bucket}/${key}`, { method }),
    {
      aws: {
        signQuery: true,
        // aws4fetch は expires オプションを直接サポートしない。デフォルト15分。
      },
    },
  )
  return req.url
}

/**
 * アップロード用の Presigned URL (PUT) を生成する
 * デフォルトで15分間有効
 * @param key オブジェクトキー (例: 'uploads/tmp/image.png')
 * @returns アップロード用 Presigned URL 文字列
 * @throws Error R2 サービスの初期化に失敗した場合
 */
async function uploadUrl(key: string): Promise<string> {
  // 必要であればキーにプレフィックスを追加するロジックをここに入れる
  // 例: const prefixedKey = `uploads/tmp/${key}`;
  // return await generatePresignedUrl(prefixedKey, 'PUT');
  return await generatePresignedUrl(key, 'PUT')
}

/**
 * ダウンロード用の Presigned URL (GET) を生成する
 * デフォルトで15分間有効
 * @param key オブジェクトキー (例: 'processed/image.png')
 * @returns ダウンロード用 Presigned URL 文字列
 * @throws Error R2 サービスの初期化に失敗した場合
 */
async function downloadUrl(key: string): Promise<string> {
  return await generatePresignedUrl(key, 'GET')
}

// --- エクスポート ---
// サービスオブジェクトとしてまとめてエクスポート
export const r2 = {
  generatePresignedUrl,
  uploadUrl,
  downloadUrl, // GET 用も追加しておくと便利かも
}
