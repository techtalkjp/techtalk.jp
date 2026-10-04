import { css, type Handle, type RemixNode } from 'remix/component'

import { container, wide } from './styles.ts'

/**
 * ページの各セクションの枠。左にセクション名、右に中身の 2 カラム。
 * 2 カラムのときは、セクション名と中身の 1 行目をベースラインでそろえる。
 * 中身が自分の見出し（h2）で始まらないセクションは、nameIsHeading でセクション名を h2 にする
 */
export function Section(
  handle: Handle<{
    id: string
    name: string
    /** セクション名を見出しにするか。中身が h2 で始まるなら付けない */
    nameIsHeading?: boolean
    children?: RemixNode
  }>,
) {
  return () => {
    let { id, name, nameIsHeading, children } = handle.props
    let nameProps = {
      id: `section-${id}`,
      mix: css({
        fontSize: 'var(--t-14)',
        lineHeight: 1.5,
        fontWeight: 700,
        color: 'var(--text-subtle)',
      }),
    }
    return (
      <section
        id={id}
        aria-labelledby={`section-${id}`}
        mix={css({
          paddingBlock: '72px',
          borderTop: '1px solid var(--border)',
          [wide]: { paddingBlock: '112px' },
        })}
      >
        <div
          mix={[
            container,
            css({
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '20px',
              [wide]: {
                gridTemplateColumns: '220px minmax(0, 1fr)',
                alignItems: 'baseline',
                gap: '48px',
              },
            }),
          ]}
        >
          {nameIsHeading ? (
            <h2 {...nameProps}>{name}</h2>
          ) : (
            <p {...nameProps}>{name}</p>
          )}
          <div>{children}</div>
        </div>
      </section>
    )
  }
}

/** セクションの見出し。28px / 700 で全セクション共通 */
export const sectionHeading = css({
  fontSize: 'var(--t-28)',
  lineHeight: 1.5,
  fontWeight: 700,
  letterSpacing: '-0.005em',
  maxWidth: '22em',
})

/** 見出しの下のリード文 */
export const sectionLede = css({
  marginTop: '20px',
  maxWidth: '36em',
  color: 'var(--text-muted)',
})
