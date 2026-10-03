import { FormDataParseError } from 'remix/form-data-parser'
import { formData } from 'remix/middleware/form-data'
import { MultipartParseError } from 'remix/multipart-parser'

/**
 * 問い合わせフォーム用の FormData 解析。ファイルは受け付けず、大きさも絞る。
 * 上限を超えた送信はサーバーエラーにせず 413 で返す。
 */
export function contactFormData() {
  let parse = formData({
    maxFiles: 0,
    maxParts: 20,
    maxTotalSize: 64 * 1024,
  })
  let middleware: typeof parse = async (context, next) => {
    try {
      return await parse(context, next)
    } catch (error) {
      if (
        error instanceof FormDataParseError ||
        error instanceof MultipartParseError
      ) {
        return new Response('Payload Too Large', { status: 413 })
      }
      throw error
    }
  }
  return middleware
}
