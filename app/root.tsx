import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@vercel/remix'
import { useEffect } from 'react'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'
import { Toaster } from '~/components/ui'
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request)
  return json({ toastData: toast }, { headers })
}

export default function App() {
  const { toastData } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (!toastData) return
    let toastFn = toast.info
    switch (toastData?.type) {
      case 'success':
        toastFn = toast.success
        break
      case 'error':
        toastFn = toast.error
        break
    }
    toastFn(toastData.message, { description: toastData.description })
  }, [toastData])

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="scroll-smooth">
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
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
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="m-8">
        <h1 className="text-4xl">
          {status} {statusText}
        </h1>
        <div className="mt-4">{message}</div>
        <Scripts />
      </body>
    </html>
  )
}
