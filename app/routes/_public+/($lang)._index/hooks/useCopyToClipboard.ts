import { useState } from 'react'

/**
 * Custom hook for copying text to clipboard with feedback
 * External synchronization: Clipboard API
 *
 * Supports both modern Clipboard API and legacy execCommand fallback
 */
export function useCopyToClipboard() {
  const [showFeedback, setShowFeedback] = useState(false)

  /**
   * Check if Clipboard API is supported and available
   */
  const isClipboardApiSupported = (): boolean => {
    if (typeof navigator === 'undefined') return false
    if (typeof navigator.clipboard !== 'object') return false
    if (typeof navigator.clipboard.writeText !== 'function') return false

    // Check if we're in a secure context (HTTPS or localhost)
    if (typeof window !== 'undefined' && typeof location !== 'undefined') {
      const isSecure =
        location.protocol === 'https:' ||
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1'
      return isSecure
    }

    return true
  }

  /**
   * Fallback method using deprecated execCommand
   * Note: execCommand is deprecated but necessary for older browsers
   * and non-secure contexts where Clipboard API is unavailable
   */
  const copyWithExecCommand = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary textarea
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        textarea.setAttribute('readonly', '')

        document.body.appendChild(textarea)

        // Select the text
        textarea.select()
        textarea.setSelectionRange(0, text.length)

        // Copy to clipboard
        const successful = document.execCommand('copy')

        // Clean up
        document.body.removeChild(textarea)

        if (successful) {
          resolve()
        } else {
          reject(new Error('Copy command failed'))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  const copy = (text: string) => {
    const copyPromise = isClipboardApiSupported()
      ? navigator.clipboard.writeText(text)
      : copyWithExecCommand(text)

    copyPromise
      .then(() => {
        setShowFeedback(true)
        setTimeout(() => {
          setShowFeedback(false)
        }, 2000)
      })
      .catch((error) => {
        console.error('Failed to copy text to clipboard:', error)
      })
  }

  return { copy, showFeedback }
}
