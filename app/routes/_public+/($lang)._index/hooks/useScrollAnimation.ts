import { useEffect } from 'react'

/**
 * Custom hook for scroll-based fade-in animations using IntersectionObserver
 * External synchronization: IntersectionObserver API
 */
export function useScrollAnimation() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-5')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.fade-in-section').forEach((section) => {
      // 初期状態のクラスを適用(JSが有効な場合のみ)
      section.classList.add(
        'opacity-0',
        'translate-y-5',
        'transition-all',
        'duration-1000',
        'ease-out',
      )
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])
}
