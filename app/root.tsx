import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react'
import type { LinksFunction, MetaFunction } from '@vercel/remix'
import biographyStyle from '~/styles/biography.css'
import globalStyles from '~/styles/globals.css'
import privacyStyles from '~/styles/privacy.css'

export const meta: MetaFunction = () => {
  return [
    { title: '株式会社TechTalk' },
    { name: 'description', content: '株式会社TechTalkの公式サイトです。' },
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ]
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: privacyStyles },
    { rel: 'stylesheet', href: biographyStyle },
  ]
}

export default function App() {
  return (
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="scroll-smooth">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
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
