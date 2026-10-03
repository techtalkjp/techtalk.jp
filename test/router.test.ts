import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import type { ContactInquiry } from '../app/contact/types.ts'
import { createAppRouter } from '../app/router.ts'

function setup(options: { failEnqueue?: boolean } = {}) {
  let created: ContactInquiry[] = []
  let router = createAppRouter({
    log: false,
    bindings: {
      db: {
        prepare: () => ({
          first: async () => ({ now: '2026-10-03 00:00:00' }),
        }),
      } as unknown as D1Database,
      contactWorkflow: {
        async create(init) {
          if (options.failEnqueue) throw new Error('boom')
          created.push(init!.params!)
          return {} as WorkflowInstance
        },
      },
    },
  })
  let fetch = (path: string, init?: RequestInit) =>
    router.fetch(new Request(new URL(path, 'http://localhost'), init))
  return { fetch, created }
}

function post(
  fields: Record<string, string>,
  headers: Record<string, string> = {},
): RequestInit {
  return { method: 'POST', body: new URLSearchParams(fields), headers }
}

const validForm = {
  name: 'テスト太郎',
  email: 'taro@example.com',
  message: 'お見積りをお願いします',
  privacyPolicy: 'on',
}

const frame = { 'X-Remix-Frame': 'true' }

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
      assert.match(response.headers.get('Cache-Control') ?? '', /s-maxage=600/)
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
    assert.match(html, /Implement Your Business\./)
  })

  it('top page embeds the contact form frame for its locale', async () => {
    let { fetch } = setup()
    let html = await (await fetch('/en')).text()
    assert.match(html, /"name":"contact","src":"\/en\/contact-form"/)
    assert.match(html, /name="email"/)
  })

  it('healthcheck queries D1', async () => {
    let { fetch } = setup()
    let response = await fetch('/healthcheck')
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), {
      status: 'ok',
      now: '2026-10-03 00:00:00',
    })
  })
})

describe('contact form', () => {
  it('frame submit enqueues the inquiry and renders the thank-you fragment', async () => {
    let { fetch, created } = setup()
    let response = await fetch('/en', post(validForm, frame))
    assert.equal(response.status, 200)
    let html = await response.text()
    assert.match(html, /role="status"/)
    assert.match(html, /Thank you for your message/)
    assert.doesNotMatch(html, /<html/)

    assert.equal(created.length, 1)
    let inquiry = created[0]!
    assert.equal(inquiry.name, 'テスト太郎')
    assert.equal(inquiry.locale, 'en')
    assert.equal(inquiry.privacyPolicy, true)
    assert.equal(inquiry.rule.tier, 'normal')
  })

  it('frame submit with invalid fields returns 400 with localized errors and values', async () => {
    let { fetch, created } = setup()
    let response = await fetch(
      '/',
      post({ name: '', email: 'bad', message: 'こんにちは' }, frame),
    )
    assert.equal(response.status, 400)
    let html = await response.text()
    assert.match(html, /お名前を入力してください/)
    assert.match(html, /正しいメールアドレスを入力してください/)
    assert.match(html, /プライバシーポリシーへの同意が必要です/)
    assert.match(html, /value="bad"/)
    assert.match(html, /こんにちは/)
    assert.equal(created.length, 0)
  })

  it('honeypot submissions look successful but are dropped', async () => {
    let { fetch, created } = setup()
    let response = await fetch(
      '/',
      post({ ...validForm, companyPhone: '0312345678' }, frame),
    )
    assert.equal(response.status, 200)
    assert.match(await response.text(), /role="status"/)
    assert.equal(created.length, 0)
  })

  it('enqueue failure shows an error and keeps the input', async () => {
    let { fetch } = setup({ failEnqueue: true })
    let response = await fetch('/', post(validForm, frame))
    assert.equal(response.status, 503)
    let html = await response.text()
    assert.match(html, /送信できませんでした/)
    assert.match(html, /taro@example\.com/)
  })

  it('submit without JS redirects to the localized thank-you state', async () => {
    let { fetch, created } = setup()
    let response = await fetch('/en', post(validForm))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), '/en?sent=1#contact')
    assert.equal(created.length, 1)

    let page = await (await fetch('/en?sent=1')).text()
    assert.match(page, /"src":"\/en\/contact-form\?sent=1"/)
    let fragment = await (await fetch('/en/contact-form?sent=1')).text()
    assert.match(fragment, /Thank you for your message/)
  })

  it('invalid submit without JS re-renders the whole page with errors', async () => {
    let { fetch } = setup()
    let response = await fetch('/', post({ name: 'x' }))
    assert.equal(response.status, 400)
    let html = await response.text()
    assert.match(html, /<html lang="ja"/)
    assert.match(html, /メールアドレスを入力してください/)
  })

  it('rejects cross-site form posts', async () => {
    let { fetch, created } = setup()
    let response = await fetch(
      '/',
      post(validForm, {
        Origin: 'https://evil.example',
        'Sec-Fetch-Site': 'cross-site',
      }),
    )
    assert.equal(response.status, 403)
    assert.equal(created.length, 0)
  })
})
