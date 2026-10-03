import { run } from 'remix/component'

import { FRAME_SUBMIT_ERROR } from '../app/islands/events.ts'
import * as islands from './islands.ts'

// アイランドはこのファイルに一緒に入れてある（1 ファイルなので、デプロイの前後で
// 古いページが新しいチャンクを読み込んで食い違うことがない）。ページ全体のソフトナビゲーションも有効にする
const app = run({
  loadModule(moduleUrl, exportName) {
    let component = (islands as Record<string, unknown>)[exportName]
    if (typeof component !== 'function') {
      return Promise.reject(
        new Error(`Unknown component: ${moduleUrl}#${exportName}`),
      )
    }
    return Promise.resolve(component)
  },

  // Remix 3.0.0 の既定の解決処理（runtime/run.ts の defaultResolveFrame）を写し、送信失敗の
  // 通知を足したもの。5xx や通信エラーでは Frame が描き直されないので、送信ボタンにエラーを出させる。
  // Remix を上げるときは既定の処理と食い違っていないか確認する
  async resolveFrame(src, options) {
    let headers = new Headers({ Accept: 'text/html', 'X-Remix-Frame': 'true' })
    if (options?.target != null) headers.set('X-Remix-Target', options.target)
    let method = options?.method?.toUpperCase() ?? 'GET'
    let isSubmit = method !== 'GET' && method !== 'HEAD'

    try {
      let response = await fetch(src, {
        method,
        headers,
        body: isSubmit
          ? toBody(options?.formData, options?.encType)
          : undefined,
        mode: 'same-origin',
        signal: options?.signal,
      })
      let isHtml = response.headers
        .get('Content-Type')
        ?.toLowerCase()
        .includes('text/html')
      if (response.status >= 500 || (response.status >= 300 && !isHtml)) {
        throw new Error(
          `Failed to resolve frame: ${response.status} ${response.statusText}`.trimEnd(),
        )
      }
      return response
    } catch (error) {
      if (isSubmit && !options?.signal?.aborted) {
        document.dispatchEvent(
          new CustomEvent(FRAME_SUBMIT_ERROR, { detail: options?.target }),
        )
      }
      throw error
    }
  },
})

/** Remix の既定の解決処理と同じく、フォームの enctype に合わせて本文を作る */
function toBody(
  formData: FormData | undefined,
  encType: string | undefined,
): BodyInit | undefined {
  if (!formData) return undefined
  if (encType === 'text/plain') {
    let text = ''
    for (let [name, value] of formData) {
      text += `${name}=${typeof value === 'string' ? value : value.name}\r\n`
    }
    return new Blob([text.replace(/\r?\n|\r/g, '\r\n')], { type: 'text/plain' })
  }
  // enctype の指定がなければ既定どおり multipart で送る
  if (encType !== 'application/x-www-form-urlencoded') return formData
  let body = new URLSearchParams()
  for (let [name, value] of formData) {
    body.append(name, typeof value === 'string' ? value : value.name)
  }
  return body
}

app.addEventListener('error', (event) => {
  console.error(event.error)
})

await app.ready()
