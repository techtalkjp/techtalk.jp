import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  specifiedTheme?: Theme
}

export function ThemeProvider({
  children,
  specifiedTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(specifiedTheme || 'system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Synchronize with cookie and system theme
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return

    // Get system theme preference
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    // Resolve the actual theme to apply
    const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
      if (currentTheme === 'system') {
        return getSystemTheme()
      }
      return currentTheme
    }

    // Apply theme on mount
    const initialResolvedTheme = resolveTheme(theme)
    setResolvedTheme(initialResolvedTheme)
    document.documentElement.classList.toggle(
      'dark',
      initialResolvedTheme === 'dark',
    )

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const newResolvedTheme = getSystemTheme()
        setResolvedTheme(newResolvedTheme)
        document.documentElement.classList.toggle(
          'dark',
          newResolvedTheme === 'dark',
        )
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    // Skip during SSR
    if (typeof window === 'undefined') return

    setThemeState(newTheme)

    // Set cookie
    // biome-ignore lint/suspicious/noDocumentCookie: Simple cookie setting is sufficient for theme preference
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; samesite=lax`

    // Resolve and apply the new theme
    const resolved =
      newTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : newTheme

    setResolvedTheme(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
