import { unsafeHTML, type Handle, type RemixNode } from 'remix/component'

import { SITE_URL } from '../config.ts'
import type { Locale } from '../i18n/index.ts'
import { globalStyles } from './global-styles.ts'

export interface Seo {
  title: string
  description?: string
  /** サイト内パス（例: `/en/biography`）。canonical と og:url に使う */
  path?: string
  ogType?: 'website' | 'profile'
  siteName?: string
  /** hreflang の ja / en それぞれのパス */
  alternates?: { ja: string; en: string }
  jsonLd?: unknown
}

export interface DocumentProps {
  locale: Locale
  seo: Seo
  children?: RemixNode
}

const OG_IMAGES: Record<Locale, string> = {
  ja: `${SITE_URL}/og-image.jpeg?v=2`,
  en: `${SITE_URL}/og-image-en.jpeg`,
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { locale, seo, children } = handle.props
    let ogImage = OG_IMAGES[locale]
    let url =
      seo.path === undefined ? undefined : SITE_URL + absolutePath(seo.path)

    return (
      <html lang={locale}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{seo.title}</title>
          {seo.description ? (
            <meta name="description" content={seo.description} />
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
          <meta property="og:image" content={ogImage} />
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
          <meta name="twitter:image" content={ogImage} />

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

          {/* SVG を読めないブラウザは favicon.ico（16/32/48px、画素にそろえて描いたもの）を使う */}
          <link rel="icon" href="/favicon.ico" sizes="48x48" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=LINE+Seed+JP:wght@400;700;800&display=swap"
          />
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
