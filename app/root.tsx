import { useEffect } from 'react'
import {
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from 'react-router'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'
import { ThemeProvider } from '~/components/theme-provider'
import { Toaster, TooltipProvider } from '~/components/ui'
import { detectLocale } from '~/i18n/utils/detectLocale'
import { getThemeFromRequest } from '~/utils/theme.server'
import type { Route } from './+types/root'
import './styles/globals.css'

export const meta: MetaFunction = () => {
  return [
    { title: 'TechTalk' },
    {
      name: 'description',
      content: 'The official website of TechTalk, Inc.',
    },
  ]
}

export const links: LinksFunction = () => {
  return [
    // SVG favicon for modern browsers
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    // JPEG fallback for older browsers
    { rel: 'icon', type: 'image/jpeg', href: '/logo.jpeg' },
    // Apple Touch Icon
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.jpeg' },
  ]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { toast, headers } = await getToast(request)
  const theme = getThemeFromRequest(request)
  const url = new URL(request.url)
  const locale = detectLocale(url.pathname)
  return data({ toastData: toast, theme, locale }, { headers })
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const data = useRouteLoaderData<typeof loader>('root')
  const locale = data?.locale || 'ja'
  const theme = data?.theme || 'system'

  // For SSR: set dark class only if theme is explicitly 'dark'
  const htmlClassName = theme === 'dark' ? 'dark' : undefined

  return (
    <html lang={locale} className={htmlClassName}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/* FOUC prevention: Apply theme before first paint */}
        {theme === 'system' && (
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for preventing FOUC when theme is system
            dangerouslySetInnerHTML={{
              __html: `
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                }
              `,
            }}
          />
        )}
      </head>
      <body className="scroll-smooth">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App({
  loaderData: { toastData, theme },
}: Route.ComponentProps) {
  // Synchronize with toast library: display toast notifications from server
  useEffect(() => {
    if (!toastData) {
      return
    }
    let toastFn = toast.info
    if (toastData.type === 'error') {
      toastFn = toast.error
    } else if (toastData.type === 'success') {
      toastFn = toast.success
    }
    toastFn(toastData.message, {
      description: toastData.description,
      position: 'top-right',
    })
  }, [toastData])

  return (
    <ThemeProvider specifiedTheme={theme || undefined}>
      <Toaster closeButton richColors />
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
    </ThemeProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  let status = 0
  let statusText = ''
  let message = ''
  if (isRouteErrorResponse(error)) {
    status = error.status
    statusText = error.statusText
    message = error.data
  } else if (error instanceof Error) {
    status = 500
    statusText = 'Internal Server Error'
    message = error.message
  }

  return (
    <div className="m-8">
      <h1 className="text-4xl">
        {status} {statusText}
      </h1>
      <div className="mt-4">{message}</div>
    </div>
  )
}
