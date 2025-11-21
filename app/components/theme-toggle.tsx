import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from './theme-provider'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // External synchronization: Wait for client-side hydration to complete
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  // During SSR and hydration, show nothing to prevent mismatch
  // The dark mode classes will apply correctly via the inline script in root.tsx
  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-white"
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-white"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
