import { useState } from 'react'

/**
 * Custom hook for copying text to clipboard with feedback
 * External synchronization: Clipboard API
 */
export function useCopyToClipboard() {
  const [showFeedback, setShowFeedback] = useState(false)

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowFeedback(true)
      setTimeout(() => {
        setShowFeedback(false)
      }, 2000)
    })
  }

  return { copy, showFeedback }
}
