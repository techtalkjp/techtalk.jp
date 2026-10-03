import type { Handle, RemixNode } from 'remix/component'

// メールクライアント向けなので、スタイルはすべて style 属性に書く
export const styles = {
  body: {
    margin: '0',
    padding: '24px 0',
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto 64px',
    padding: '20px 48px 48px',
    maxWidth: '600px',
  },
  h1: {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0 20px',
  },
  hr: { border: 'none', borderTop: '1px solid #e6ebf1', margin: '20px 0' },
  label: {
    color: '#666',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '16px 0 4px',
  },
  value: { color: '#333', fontSize: '16px', margin: '0 0 8px' },
  paragraph: {
    color: '#333',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 16px',
  },
  message: {
    color: '#333',
    fontSize: '16px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    margin: '0',
  },
  footer: { color: '#999', fontSize: '12px', margin: '4px 0' },
} as const

export function EmailLayout(
  handle: Handle<{ lang: string; preview: string; children?: RemixNode }>,
) {
  return () => (
    <html lang={handle.props.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{handle.props.preview}</title>
      </head>
      <body style={styles.body}>
        {/* 受信一覧のプレビュー文 */}
        <div style={{ display: 'none', maxHeight: '0', overflow: 'hidden' }}>
          {handle.props.preview}
        </div>
        <div style={styles.container}>{handle.props.children}</div>
      </body>
    </html>
  )
}
