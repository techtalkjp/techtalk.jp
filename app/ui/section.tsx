import { css, type Handle, type RemixNode } from 'remix/component'

import { container, medium, wide } from './styles.ts'

/**
 * ページの各セクションの枠。見出しの上に小さなラベルは置かず、見出しそのものに語らせる。
 * 中身が自分の見出し（h2）で始まらないセクションは、nameIsHeading でセクション名を h2 にする。
 * そうでなければセクション名は読み上げ用の名前にだけ使う
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
    return (
      <section
        id={id}
        aria-labelledby={nameIsHeading ? `section-${id}` : undefined}
        aria-label={nameIsHeading ? undefined : name}
        mix={css({
          paddingBlock: '80px',
          [wide]: { paddingBlock: '128px' },
        })}
      >
        <div mix={container}>
          {nameIsHeading ? (
            <h2
              id={`section-${id}`}
              mix={[sectionHeading, css({ marginBottom: '32px' })]}
            >
              {name}
            </h2>
          ) : null}
          {children}
        </div>
      </section>
    )
  }
}

/** セクションの見出し。全セクション共通 */
export const sectionHeading = css({
  fontSize: 'var(--t-40)',
  lineHeight: 1.3,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  maxWidth: '20em',
})

/** 見出しの下のリード文 */
export const sectionLede = css({
  marginTop: '20px',
  maxWidth: '34em',
  color: 'var(--text-muted)',
  [medium]: { fontSize: 'var(--t-18)', lineHeight: 1.7 },
})
