import type { Handle, RemixNode } from 'remix/component'

import type { I18n } from './index.ts'

/** リクエストごとの翻訳関数を、サーバー描画のコンポーネントツリーに渡す */
export function I18nProvider(
  handle: Handle<{ value: I18n; children?: RemixNode }, I18n>,
) {
  handle.context.set(handle.props.value)
  return () => handle.props.children
}

export function getI18n(handle: Handle<any>): I18n {
  return handle.context.get(I18nProvider)
}
