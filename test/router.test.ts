import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { createAppRouter } from '../app/router.ts'

function setup() {
  let router = createAppRouter({ log: false })
  let fetch = (path: string, init?: RequestInit) =>
    // `//evil.com/` のようなパスもそのまま送るため、URL を文字列でつなぐ
    router.fetch(new Request(`http://localhost${path}`, init))
  return { fetch }
}

function post(fields: Record<string, string>): RequestInit {
  return { method: 'POST', body: new URLSearchParams(fields) }
}

describe('pages', () => {
  for (let [path, lang] of [
    ['/', 'ja'],
    ['/en', 'en'],
    ['/biography', 'ja'],
    ['/en/biography', 'en'],
    ['/privacy', 'ja'],
  ] as const) {
    it(`GET ${path} renders <html lang="${lang}">`, async () => {
      let { fetch } = setup()
      let response = await fetch(path)
      assert.equal(response.status, 200)
      assert.match(response.headers.get('Cache-Control') ?? '', /public/)
      let html = await response.text()
      assert.match(html, new RegExp(`<html lang="${lang}"`))
    })
  }

  for (let path of ['/fr', '/fr/biography', '/en/privacy', '/nope']) {
    it(`GET ${path} is 404`, async () => {
      let { fetch } = setup()
      let response = await fetch(path)
      assert.equal(response.status, 404)
    })
  }

  it('renders 404 pages in the locale from the path', async () => {
    let { fetch } = setup()
    let html = await (await fetch('/en/nope')).text()
    assert.match(html, /<html lang="en"/)
    assert.match(html, /Page not found/)
  })

  it('top page carries SEO tags and JSON-LD', async () => {
    let { fetch } = setup()
    let html = await (await fetch('/en')).text()
    assert.match(
      html,
      /<link rel="canonical" href="https:\/\/www\.techtalk\.jp\/en"/,
    )
    assert.match(
      html,
      /hrefLang="x-default" href="https:\/\/www\.techtalk\.jp"/i,
    )
    assert.match(html, /<script type="application\/ld\+json">/)
    assert.match(
      html,
      /<title>From a conversation about technology to a new business/,
    )
    let ja = await (await fetch('/')).text()
    assert.match(ja, /<title>技術の話から、新しい事業をつくる。/)
  })

  it('top page links to Messenger instead of a contact form', async () => {
    let { fetch } = setup()
    let html = await (await fetch('/en')).text()
    assert.match(html, /href="https:\/\/m\.me\/mizoguchi\.coji"/)
    assert.doesNotMatch(html, /<form/)
  })

  // フォームを閉じたので、送信を受ける URL はどれも残っていない（営業ツールが直接送ってくる）
  for (let path of ['/', '/en', '/contact-form', '/en/contact-form']) {
    it(`POST ${path} is not accepted`, async () => {
      let { fetch } = setup()
      let response = await fetch(path, post({ name: 'x', message: 'x' }))
      assert.ok(response.status >= 400, String(response.status))
    })
  }

  it('redirects form posts to canonical paths with 308', async () => {
    let { fetch } = setup()
    let response = await fetch('/en/', post({}))
    assert.equal(response.status, 308)
    assert.equal(response.headers.get('Location'), 'http://localhost/en')
  })

  for (let [from, to] of [
    ['/en/', '/en'],
    ['/biography/', '/biography'],
    ['/en/biography/?ref=x', '/en/biography?ref=x'],
    ['//evil.com/', '/evil.com'],
    ['/ja', '/'],
    ['/ja/biography', '/biography'],
    // 旧 /ja と末尾スラッシュが重なっても 1 回で寄せる
    ['/ja/', '/'],
    ['/ja/biography/', '/biography'],
  ] as const) {
    it(`GET ${from} redirects to ${to}`, async () => {
      let { fetch } = setup()
      let response = await fetch(from)
      assert.equal(response.status, 301)
      assert.equal(
        response.headers.get('Location'),
        new URL(to, 'http://localhost').href,
      )
    })
  }

  it('pages are public but always revalidated', async () => {
    let { fetch } = setup()
    let response = await fetch('/')
    assert.equal(
      response.headers.get('Cache-Control'),
      'public, max-age=0, must-revalidate',
    )
  })
})
