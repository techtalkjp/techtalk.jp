import { useEffect } from 'react'

/**
 * Custom hook for biography page scroll-based animations
 * External synchronization: IntersectionObserver API
 */
export function useBiographyScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-5')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      },
    )

    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach((el) => {
      observer.observe(el)
    })

    return () => {
      animatedElements.forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])
}
