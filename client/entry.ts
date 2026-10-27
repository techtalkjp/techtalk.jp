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

// Frame への送信中は送信ボタンが押せなくなり、描き直しで中身も差し替わるので、フォーカスが body に落ちる。
// 終わったら、最初のエラーの欄（なければ結果の知らせ）にフォーカスを移す。
// 送れなかったとき（5xx、通信エラー）は Frame が描き直されず前回の表示が残るので、送信ボタンに戻す。
// 待っている間に利用者が別の場所へ移っていたら動かさない
document.addEventListener('submit', (event) => {
  let form = event.target
  // 入力エラーで止められた送信は Frame を描き直さないので、待たない
  if (event.defaultPrevented || !(form instanceof HTMLFormElement)) return
  let target = form.getAttribute('data-rmx-target')
  let frame = target ? app.frames.get(target) : undefined
  let scope = form.closest('section')
  if (!frame || !scope) return
  let done = new AbortController()
  let failed = false
  document.addEventListener(
    FRAME_SUBMIT_ERROR,
    (error) => {
      if ((error as CustomEvent).detail === target) failed = true
    },
    { signal: done.signal },
  )
  frame.addEventListener(
    'reloadComplete',
    () => {
      done.abort()
      // 送信ボタン（アイランド）の描き直しを待ってから探す
      requestAnimationFrame(() => {
        let active = document.activeElement
        if (active && active !== document.body) return
        let next = failed
          ? scope.querySelector<HTMLElement>('button[type="submit"]')
          : (scope.querySelector<HTMLElement>('[aria-invalid="true"]') ??
            scope.querySelector<HTMLElement>('[role="alert"], [role="status"]'))
        if (!next) return
        if (!next.matches('input, textarea, button, a[href]')) {
          next.tabIndex = -1
        }
        next.focus()
      })
    },
    { once: true },
  )
})

await app.ready()
