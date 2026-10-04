import { css, type Handle, type RemixNode } from 'remix/component'

import { container, wide } from './styles.ts'

/**
 * 下層ページの冒頭。トップのヒーローと同じ見出しの大きさと余白で、ページの名前を出す
 */
export function PageIntro(
  handle: Handle<{
    title: RemixNode
    lede?: RemixNode
    /** 見出しの上に置くもの（経歴ページの写真など） */
    before?: RemixNode
    /** リード文の下に置くもの（リンクやボタン） */
    children?: RemixNode
  }>,
) {
  return () => {
    let { title, lede, before, children } = handle.props
    return (
      <div
        mix={[
          container,
          css({
            padding: '64px 24px 72px',
            [wide]: { padding: '104px 24px 96px' },
          }),
        ]}
      >
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
              marginTop: '24px',
              maxWidth: '32em',
              fontSize: 'var(--t-18)',
              color: 'var(--text-muted)',
              '@media (min-width: 760px)': {
                fontSize: 'var(--t-20)',
                lineHeight: 1.6,
              },
            })}
          >
            {lede}
          </p>
        ) : null}
        {children}
      </div>
    )
  }
}
