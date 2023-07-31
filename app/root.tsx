import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { LinksFunction, V2_MetaFunction } from '@vercel/remix'
import { createHead } from 'remix-island'
import biographyStyle from '~/styles/biography.css'
import globalStyles from '~/styles/globals.css'
import privacyStyles from '~/styles/privacy.css'

export const meta: V2_MetaFunction = () => {
  return [
    { title: '株式会社TechTalk' },
    { name: 'description', content: '株式会社TechTalkの公式サイトです。' },
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ]
}

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
))

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: privacyStyles },
    { rel: 'stylesheet', href: biographyStyle },
  ]
}

export default function App() {
  return (
    <>
      <Head />
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <Head />
      <div>
        <h1 className="text-5xl">
          [Error]: There was an error: {String(error)}
        </h1>
      </div>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
