import { unsafeHTML, type Handle, type RemixNode } from 'remix/component'

import { SITE_URL } from '../config.ts'
import type { Locale } from '../i18n/index.ts'
import { globalStyles, themeScript } from './global-styles.ts'

export interface Seo {
  title: string
  description?: string
  /** サイト内パス（例: `/en/biography`）。canonical と og:url に使う */
  path?: string
  ogType?: 'website' | 'profile'
  siteName?: string
  keywords?: string
  /** hreflang の ja / en それぞれのパス */
  alternates?: { ja: string; en: string }
  jsonLd?: unknown
}

export interface DocumentProps {
  locale: Locale
  seo: Seo
  children?: RemixNode
}

const OG_IMAGE = `${SITE_URL}/og-image.jpeg`

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { locale, seo, children } = handle.props
    let url =
      seo.path === undefined ? undefined : SITE_URL + absolutePath(seo.path)

    return (
      // data-theme はクライアント側で付けるので、ソフトナビゲーションの差分更新で消さない
      <html lang={locale} data-rmx-preserve-attrs="data-theme">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script innerHTML={unsafeHTML(themeScript)} />
          <title>{seo.title}</title>
          {seo.description ? (
            <meta name="description" content={seo.description} />
          ) : null}
          {seo.keywords ? (
            <meta name="keywords" content={seo.keywords} />
          ) : null}
          <meta name="author" content="TechTalk, Inc." />
          <meta name="robots" content="index, follow" />

          <meta property="og:type" content={seo.ogType ?? 'website'} />
          {url ? <meta property="og:url" content={url} /> : null}
          <meta property="og:title" content={seo.title} />
          {seo.description ? (
            <meta property="og:description" content={seo.description} />
          ) : null}
          {seo.siteName ? (
            <meta property="og:site_name" content={seo.siteName} />
          ) : null}
          <meta property="og:image" content={OG_IMAGE} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta
            property="og:locale"
            content={locale === 'ja' ? 'ja_JP' : 'en_US'}
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.title} />
          {seo.description ? (
            <meta name="twitter:description" content={seo.description} />
          ) : null}
          <meta name="twitter:image" content={OG_IMAGE} />

          {url ? <link rel="canonical" href={url} /> : null}
          {seo.alternates ? (
            <>
              <link
                rel="alternate"
                hrefLang="ja"
                href={SITE_URL + absolutePath(seo.alternates.ja)}
              />
              <link
                rel="alternate"
                hrefLang="en"
                href={SITE_URL + absolutePath(seo.alternates.en)}
              />
              <link
                rel="alternate"
                hrefLang="x-default"
                href={SITE_URL + absolutePath(seo.alternates.ja)}
              />
            </>
          ) : null}

          <link rel="icon" type="image/svg+xml" href="/logo.svg" />
          <link rel="icon" type="image/jpeg" href="/logo.jpeg" />
          <link rel="apple-touch-icon" sizes="180x180" href="/logo.jpeg" />
          <style innerHTML={unsafeHTML(globalStyles)} />
          {seo.jsonLd ? (
            <script
              type="application/ld+json"
              innerHTML={unsafeHTML(
                JSON.stringify(seo.jsonLd).replaceAll('<', '\\u003c'),
              )}
            />
          ) : null}
          <script type="module" src="/js/entry.js" />
        </head>
        <body>{children}</body>
      </html>
    )
  }
}

/** SITE_URL に続けるパス。トップは SITE_URL そのもの（末尾スラッシュなし）にする */
function absolutePath(path: string): string {
  return path === '/' ? '' : path
}
