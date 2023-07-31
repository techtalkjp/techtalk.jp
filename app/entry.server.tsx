import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { renderHeadToString } from 'remix-island'
import { PassThrough } from 'stream'
import { Head } from './root'

const ABORT_DELAY = 5000

const handleRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) =>
  isbot(request.headers.get('user-agent'))
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
export default handleRequest

const handleBotRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) =>
  new Promise((resolve, reject) => {
    let didError = false

    const stream = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onAllReady: () => {
          const head = renderHeadToString({ request, remixContext, Head })
          const body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )
          const bodyWithStyles = `<!DOCTYPE html><html lang="ja"><head>${head}</head><body><div id="root">`
          body.write(bodyWithStyles)
          stream.pipe(body)
          body.write(`</div></body></html>`)
        },
        onShellError: (error: unknown) => {
          reject(error)
        },
        onError: (error: unknown) => {
          didError = true
          console.error(error)
        },
      },
    )

    setTimeout(() => stream.abort(), ABORT_DELAY)
  })

const handleBrowserRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) =>
  new Promise((resolve, reject) => {
    let didError = false
    const stream = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady: () => {
          const head = renderHeadToString({ request, remixContext, Head })
          const body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )

          const bodyWithStyles = `<!DOCTYPE html><html lang="ja"><head>${head}</head><body><div id="root">`
          body.write(bodyWithStyles)
          stream.pipe(body)
          body.write(`</div></body></html>`)
        },
        onShellError: (error: unknown) => {
          reject(error)
        },
        onError: (error: unknown) => {
          didError = true

          console.error(error)
        },
      },
    )

    setTimeout(() => stream.abort(), ABORT_DELAY)
  })
