import { run } from 'remix/component'

import { FRAME_SUBMIT_ERROR } from '../app/islands/events.ts'

// clientEntry のモジュールを読み込み、ページ全体のソフトナビゲーションを有効にする
const app = run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    let component = mod[exportName]
    if (typeof component !== 'function') {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`)
    }
    return component
  },

  // Remix の既定の解決処理と同じ動きに、送信失敗の通知を足したもの。
  // 5xx や通信エラーでは Frame が描き直されないので、送信ボタンにエラーを出させる
  async resolveFrame(src, options) {
    let headers = new Headers({ Accept: 'text/html', 'X-Remix-Frame': 'true' })
    if (options?.target != null) headers.set('X-Remix-Target', options.target)
    let method = options?.method?.toUpperCase() ?? 'GET'
    let isSubmit = method !== 'GET' && method !== 'HEAD'

    try {
      let response = await fetch(src, {
        method,
        headers,
        body: isSubmit ? toBody(options?.formData) : undefined,
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

/** 文字列だけのフォームは application/x-www-form-urlencoded で送る */
function toBody(formData: FormData | undefined): BodyInit | undefined {
  if (!formData) return undefined
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
