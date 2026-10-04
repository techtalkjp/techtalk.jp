import { css, type Handle } from 'remix/component'

import { ArrowUpRightIcon } from './icons.tsx'
import { sm } from './styles.ts'

const press = [
  {
    href: 'https://forbesjapan.com/articles/detail/22941',
    publisher: 'Forbes JAPAN',
    title: '合弁会社で世界へ タクシーメディアの掲げる野望',
  },
  {
    href: 'https://thebridge.jp/2014/06/takanori-oshiba-interview-series-vol-7',
    publisher: 'THE BRIDGE',
    title:
      '「本田の描く広告の未来を実現する」フリークアウト 溝口氏インタビュー',
  },
  {
    href: 'https://japan.cnet.com/article/20361283/',
    publisher: 'CNET Japan',
    title: 'ニワンゴ技術責任者が語る、「ニコニコ動画」成功の鍵',
  },
]

/** 掲載記事の一覧。媒体名・題名・外部リンクの矢印を 1 行に並べる */
export function PressList(handle: Handle<{ firstRowAligned?: boolean }>) {
  return () => (
    <ul
      // リストの見た目を消すと Safari の読み上げがリストとして扱わなくなるので、明示する
      role="list"
    >
      {press.map((article) => (
        <li key={article.href}>
          <a
            href={article.href}
            target="_blank"
            rel="noopener"
            mix={css({
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '2px',
              padding: '16px 0',
              borderBottom: '1px solid var(--border)',
              '&:hover .title': { color: 'var(--accent)' },
              // 左のセクション名と 1 行目を同じ線に乗せる
              'li:first-child > &': handle.props.firstRowAligned
                ? { paddingTop: '6px' }
                : {},
              [sm]: {
                gridTemplateColumns: '160px minmax(0, 1fr) auto',
                gap: '24px',
                alignItems: 'baseline',
              },
            })}
          >
            <span
              mix={css({
                fontSize: 'var(--t-14)',
                color: 'var(--text-subtle)',
              })}
            >
              {article.publisher}
            </span>
            {/* 記事の題名は原題のまま載せる */}
            <span
              class="title"
              lang="ja"
              mix={css({ transition: 'color 150ms ease-out' })}
            >
              {article.title}
            </span>
            <span
              mix={css({
                display: 'none',
                color: 'var(--text-subtle)',
                [sm]: { display: 'block' },
              })}
            >
              <ArrowUpRightIcon size={13} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
