import {
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  unstable_data,
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
import { Toaster, TooltipProvider } from '~/components/ui'
import { cn } from './libs/utils'
import biographyStyle from './styles/biography.css?url'
import globalStyles from './styles/globals.css?url'
import privacyStyles from './styles/privacy.css?url'

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
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: privacyStyles },
    { rel: 'stylesheet', href: biographyStyle },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request)
  return unstable_data({ toastData: toast }, { headers })
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
      <body className={cn('scroll-smooth', !isDemo && 'dark')}>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { toastData } = useLoaderData<typeof loader>()

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
