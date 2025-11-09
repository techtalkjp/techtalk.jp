import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => {
  return [
    { title: '型安全な AI チャット | TechTalk.jp' },
    {
      name: 'description',
      content:
        'Vercel AI SDK v5 のツール呼び出しを型安全に実装したチャットデモ',
    },
  ]
}
