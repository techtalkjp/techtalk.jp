import { useEffect } from 'react'

const ScrollAnimation = () => {
  useEffect(() => {
    const elements = [
      ...document.querySelectorAll('.scroll-fade-in'),
      ...document.querySelectorAll('.inview-fade-in'),
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        }
      },
      { threshold: 0.2 },
    )

    for (const element of elements) observer.observe(element)

    return () => {
      for (const element of elements) {
        observer.unobserve(element)
      }
    }
  }, [])

  return null
}

export default ScrollAnimation
