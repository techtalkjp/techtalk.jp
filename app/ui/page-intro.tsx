import { css, type Handle, type RemixNode } from 'remix/component'

import { container, medium, wide } from './styles.ts'

/**
 * ページの冒頭。ページの名前を大きな見出しで出し、リード文と、その下に置くもの（ボタンなど）を続ける。
 * トップのヒーローもこれを使う
 */
export function PageIntro(
  handle: Handle<{
    title: RemixNode
    lede?: RemixNode
    /** 見出しの上に置くもの（経歴ページの写真など） */
    before?: RemixNode
    /** リード文の下に置くもの（ボタンなど） */
    children?: RemixNode
  }>,
) {
  return () => {
    let { title, lede, before, children } = handle.props
    return (
      <div
        mix={css({
          paddingBlock: '64px 72px',
          [wide]: { paddingBlock: '104px 96px' },
        })}
      >
        <div mix={container}>
          {before}
          <h1
            mix={css({
              fontSize: 'var(--t-display)',
              lineHeight: 1.25,
              fontWeight: 700,
              letterSpacing: '-0.025em',
            })}
          >
            {title}
          </h1>
          {lede ? (
            <p
              mix={css({
                marginTop: '32px',
                maxWidth: '32em',
                fontSize: 'var(--t-18)',
                color: 'var(--text-muted)',
                [medium]: { fontSize: 'var(--t-20)', lineHeight: 1.6 },
              })}
            >
              {lede}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    )
  }
}
