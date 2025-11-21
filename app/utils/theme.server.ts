import type { Theme } from '~/components/theme-provider'

const THEME_COOKIE_NAME = 'theme'

export function getThemeFromRequest(request: Request): Theme | null {
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())
  const themeCookie = cookies.find((cookie) =>
    cookie.startsWith(`${THEME_COOKIE_NAME}=`),
  )

  if (!themeCookie) return null

  const theme = themeCookie.split('=')[1] as Theme
  if (theme === 'light' || theme === 'dark' || theme === 'system') {
    return theme
  }

  return null
}

export function createThemeCookie(theme: Theme): string {
  return `${THEME_COOKIE_NAME}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`
}
