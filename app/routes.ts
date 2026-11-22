import { get, route } from 'remix/routes'

// パターンは先頭の / なしで書く。(:lang) は省略可能なロケール（ja は接頭辞なし）
export const routes = route({
  home: get('(:lang)'),
  biography: get('(:lang/)biography'),
  privacy: get('privacy'),
  healthcheck: get('healthcheck'),
})
