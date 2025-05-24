import { useState } from 'react'
import { Card, Separator } from '~/components/ui'
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard'
import type { Artifact } from '../types/artifact'
import { ArtifactContent } from './artifact-content'
import { ArtifactHeader } from './artifact-header'

export const ArtifactViewer = ({ artifact }: { artifact: Artifact }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { copied, copy } = useCopyToClipboard()

  const handleDownload = () => {
    const blob = new Blob([artifact.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${artifact.title}.${artifact.type === 'CODE' ? artifact.language : 'txt'}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="relative mt-3">
      <ArtifactHeader
        artifact={artifact}
        onCopy={() => copy(artifact.content)}
        onDownload={handleDownload}
        onExpand={() => setIsExpanded(!isExpanded)}
        copied={copied}
      />
      <Separator />
      <ArtifactContent artifact={artifact} isExpanded={isExpanded} />

      {copied && (
        <div className="bg-primary text-primary-foreground absolute top-2 right-2 z-10 rounded px-2 py-1 text-xs">
          コピーしました！
        </div>
      )}
    </Card>
  )
}
