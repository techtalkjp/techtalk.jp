import type { BundledLanguage } from 'shiki'
import {
  CodeBlock,
  CodeBlockCopyButton,
} from '~/components/ai-elements/code-block'

type MarkdownRendererProps = {
  content: string
}

/**
 * Markdownテキストをパースしてコードブロックを抽出し、
 * 適切なコンポーネントで表示する
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // コードブロックの正規表現パターン
  const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // コードブロックを抽出
  const matches = Array.from(content.matchAll(codeBlockPattern))

  for (const match of matches) {
    // コードブロック前のテキスト
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index)
      if (text.trim()) {
        parts.push(
          <div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">
            {text.split('\n').map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>,
        )
      }
    }

    // コードブロック
    const language = (match[1] || 'text') as BundledLanguage
    const code = match[2] || ''

    parts.push(
      <CodeBlock
        code={code}
        key={`code-${match.index}`}
        language={language}
        showLineNumbers
      >
        <CodeBlockCopyButton />
      </CodeBlock>,
    )

    if (match.index !== undefined) {
      lastIndex = match.index + match[0].length
    }
  }

  // 残りのテキスト
  if (lastIndex < content.length) {
    const text = content.slice(lastIndex)
    if (text.trim()) {
      parts.push(
        <div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">
          {text.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00A0'}</p>
          ))}
        </div>,
      )
    }
  }

  // コードブロックがない場合は通常のテキストとして表示
  if (parts.length === 0) {
    return (
      <div className="prose prose-sm max-w-none">
        {content.split('\n').map((line, i) => (
          <p key={i}>{line || '\u00A0'}</p>
        ))}
      </div>
    )
  }

  return <div className="space-y-4">{parts}</div>
}
