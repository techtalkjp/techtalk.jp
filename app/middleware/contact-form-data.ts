import {
  FormDataParseError,
  MaxFilesExceededError,
} from 'remix/form-data-parser'
import { formData } from 'remix/middleware/form-data'
import {
  MaxFileSizeExceededError,
  MaxHeaderSizeExceededError,
  MaxPartsExceededError,
  MaxTotalSizeExceededError,
  MultipartParseError,
} from 'remix/multipart-parser'

/**
 * 問い合わせフォーム用の FormData 解析。ファイルは受け付けず、大きさも絞る。
 * 本文 10000 文字の日本語は urlencoded で約 90KB になるので、上限は 256KB にする。
 * 解析できない送信はサーバーエラーにせず、上限超えは 413、壊れた本文は 400 で返す。
 */
export function contactFormData() {
  let parse = formData({
    maxFiles: 0,
    maxParts: 20,
    maxTotalSize: 256 * 1024,
  })
  let middleware: typeof parse = async (context, next) => {
    let parsed = false
    try {
      return await parse(context, () => {
        parsed = true
        return next()
      })
    } catch (error) {
      // 解析が終わったあと（ハンドラ）で起きたエラーはそのまま投げる
      if (parsed) throw error
      if (isLimitError(error)) {
        return new Response('Payload Too Large', { status: 413 })
      }
      if (
        error instanceof FormDataParseError ||
        error instanceof MultipartParseError
      ) {
        return new Response('Bad Request', { status: 400 })
      }
      throw error
    }
  }
  return middleware
}

function isLimitError(error: unknown): boolean {
  return (
    error instanceof MaxFilesExceededError ||
    error instanceof MaxFileSizeExceededError ||
    error instanceof MaxHeaderSizeExceededError ||
    error instanceof MaxPartsExceededError ||
    error instanceof MaxTotalSizeExceededError
  )
}
