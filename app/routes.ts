import { form, get, route } from 'remix/routes'

// パターンは先頭の / なしで書く。(:lang) は省略可能なロケール（ja は接頭辞なし）
export const routes = route({
  // GET はトップページ、POST は問い合わせの送信
  home: form('(:lang)'),
  biography: get('(:lang/)biography'),
  privacy: get('privacy'),
  // トップに埋め込む問い合わせフォームの Frame。GET はフォーム、POST は JS ありの送信
  contactForm: form('(:lang/)contact-form'),
  healthcheck: get('healthcheck'),
})
