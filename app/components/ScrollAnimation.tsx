import { useEffect } from 'react'
import { useLocation } from 'react-router'

const ScrollAnimation = () => {
  const location = useLocation()

  // biome-ignore lint/correctness/useExhaustiveDependencies: location.key changes on every navigation
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully updated
    const frame = requestAnimationFrame(() => {
      const elements = [
        ...document.querySelectorAll('.scroll-fade-in'),
        ...document.querySelectorAll('.inview-fade-in'),
      ]

      // Immediately show elements that are in viewport on page load/navigation
      for (const element of elements) {
        const rect = element.getBoundingClientRect()
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
        if (isInViewport) {
          element.classList.add('visible')
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) entry.target.classList.add('visible')
          }
        },
        { threshold: 0.2 },
      )

      for (const element of elements) {
        observer.observe(element)
      }
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [location.key])

  return null
}

export default ScrollAnimation
