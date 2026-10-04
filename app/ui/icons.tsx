// lucide-static v1.41.0 (ISC) のアイコンをインライン化したもの
import type { Handle, RemixNode } from 'remix/component'

export interface IconProps {
  size?: number
  strokeWidth?: number
}

function Lucide(handle: Handle<IconProps & { children?: RemixNode }>) {
  return () => {
    let { size = 16, strokeWidth = 2, children } = handle.props
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }
}

export function ArrowUpRightIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </Lucide>
  )
}
