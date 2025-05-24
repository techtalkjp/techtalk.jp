import { useEffect, useRef } from 'react'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useAutoScroll = (dependency: any) => {
  const ref = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log('Auto-scrolling to the bottom of the message list')
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dependency])

  return ref
}
