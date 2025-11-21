import { useEffect } from 'react'

/**
 * Custom hook for scroll-based animations
 * External synchronization: IntersectionObserver API
 *
 * Observes elements with specific class names and adds animation classes when they enter viewport:
 * - `.fade-in-section` - Elements that fade in on scroll
 * - `.animate-on-scroll` - Elements that slide up and fade in on scroll
 */
export function useScrollAnimation() {
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

    // Observe both fade-in-section and animate-on-scroll elements
    const animatedElements = document.querySelectorAll(
      '.fade-in-section, .animate-on-scroll',
    )
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
