import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react'
import { useEffect } from 'react'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'
import { Toaster } from '~/components/ui'
import { cn } from './libs/utils'
import biographyStyle from './styles/biography.css?url'
import globalStyles from './styles/globals.css?url'
import privacyStyles from './styles/privacy.css?url'

export const meta: MetaFunction = () => {
  return [
    { title: '株式会社TechTalk' },
    { name: 'description', content: '株式会社TechTalkの公式サイトです。' },
  ]
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: privacyStyles },
    { rel: 'stylesheet', href: biographyStyle },
  ]
}

export const loader = async ({ request, response }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request)
  const toastCookie = headers.get('Set-Cookie')
  if (toast && toastCookie) {
    response?.headers.append('Set-Cookie', toastCookie)
  }
  return { toastData: toast } // , { headers: toast ? headers : undefined })
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const isDemo = location.pathname.startsWith('/demo')

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={cn(
          'scroll-smooth',
          isDemo ? 'bg-background text-foreground' : 'bg-black text-white',
        )}
      >
        <Toaster />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { toastData } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (toastData) {
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
    }
  }, [toastData])

  return <Outlet />
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
