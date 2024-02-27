import { RemixServer } from '@remix-run/react'
import { handleRequest } from '@vercel/remix'

export default function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  remixContext: any,
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixServer,
  )
}
