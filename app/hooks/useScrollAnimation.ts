import { useEffect } from 'react'

/**
 * Custom hook for scroll-based animations
 * External synchronization: IntersectionObserver API and MutationObserver API
 *
 * Observes elements with specific class names and adds animation classes when they enter viewport:
 * - `.fade-in-section` - Elements that fade in on scroll
 * - `.animate-on-scroll` - Elements that slide up and fade in on scroll
 *
 * Also watches for dynamically added elements via MutationObserver
 */
export function useScrollAnimation() {
  useEffect(() => {
    const selector = '.fade-in-section, .animate-on-scroll'

    // IntersectionObserver for scroll animations
    const intersectionObserver = new IntersectionObserver(
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

    // Helper function to observe elements
    const observeElements = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        intersectionObserver.observe(el)
      })
    }

    // Observe initial elements
    const initialElements = document.querySelectorAll(selector)
    observeElements(initialElements)

    // MutationObserver for dynamically added elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is an element
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element

            // Check if the element itself matches the selector
            if (element.matches(selector)) {
              intersectionObserver.observe(element)
            }

            // Check for matching descendants
            const descendants = element.querySelectorAll(selector)
            observeElements(descendants)
          }
        })
      })
    })

    // Start observing the document for added nodes
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      // Disconnect both observers
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}
