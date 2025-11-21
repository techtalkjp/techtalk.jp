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
} from 'react-router'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'
import { ThemeProvider } from '~/components/theme-provider'
import { Toaster, TooltipProvider } from '~/components/ui'
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
  return data({ toastData: toast, theme }, { headers })
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/* Prevent flash of unstyled content (FOUC) for theme */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for preventing FOUC on theme
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getTheme() {
                  const cookie = document.cookie.split(';').find(c => c.trim().startsWith('theme='));
                  if (cookie) return cookie.split('=')[1];
                  const stored = localStorage.getItem('theme');
                  if (stored) return stored;
                  return 'system';
                }

                function resolveTheme(theme) {
                  if (theme === 'system') {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  return theme;
                }

                const theme = getTheme();
                const resolved = resolveTheme(theme);

                if (resolved === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
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
