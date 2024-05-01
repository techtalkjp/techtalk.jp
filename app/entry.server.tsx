import { RemixServer } from '@remix-run/react'
import { handleRequest, type EntryContext } from '@vercel/remix'
import { createSitemapGenerator } from 'remix-sitemap'

const { isSitemapUrl, sitemap } = createSitemapGenerator({
  siteUrl: 'https://www.techtalk.jp',
  generateRobotsTxt: true,
})

export default async function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  if (isSitemapUrl(request)) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return await sitemap(request, remixContext as any)
  }
  const remixServer = <RemixServer context={remixContext} url={request.url} />
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixServer,
  )
}
