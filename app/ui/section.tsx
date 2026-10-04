import { css, type Handle, type RemixNode } from 'remix/component'

import { container, wide } from './styles.ts'

/**
 * ページの各セクションの枠。左にセクション名、右に中身の 2 カラム。
 * セクション名の 1 行目は h2（28px × 1.5 = 42px）と同じ高さにして、右の見出しと同じ線に乗せる
 */
export function Section(
  handle: Handle<{ id: string; name: string; children?: RemixNode }>,
) {
  return () => {
    let { id, name, children } = handle.props
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
                gap: '48px',
              },
            }),
          ]}
        >
          <p
            id={`section-${id}`}
            mix={css({
              fontSize: 'var(--t-14)',
              fontWeight: 700,
              color: 'var(--text-subtle)',
              lineHeight: 1.5,
              [wide]: { lineHeight: '42px' },
            })}
          >
            {name}
          </p>
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
