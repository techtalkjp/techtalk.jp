import { r2 } from '~/services/r2.server'
import type { Route } from './+types/api.r2.$prefix.$key'

/**
 * R2からファイルを取得して返す
 * GET /demo/llm/chat/api/r2/:prefix/:key
 */
export async function loader({ params }: Route.LoaderArgs) {
  const { prefix, key } = params

  // R2のダウンロードURLを生成
  const downloadUrl = await r2.downloadUrl(`${prefix}/${key}`)

  // ダウンロードURLにリダイレクト
  return Response.redirect(downloadUrl, 302)
}
