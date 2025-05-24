import { Check, Copy, Download, Maximize2, Play } from 'lucide-react'
import { Badge, Button, CardHeader } from '~/components/ui'
import { ARTIFACT_TYPES, type Artifact } from '../types/artifact'
import { ArtifactIcon } from './artifact-icon'

export const ArtifactHeader = ({
  artifact,
  onCopy,
  onDownload,
  onExpand,
  copied,
}: {
  artifact: Artifact
  onCopy: () => void
  onDownload: () => void
  onExpand: () => void
  copied: boolean
}) => (
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ArtifactIcon type={artifact.type} />
        <span className="text-sm font-medium">{artifact.title}</span>
        {artifact.type === ARTIFACT_TYPES.CODE && artifact.language && (
          <Badge variant="secondary" className="text-xs">
            {artifact.language}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1">
        {artifact.type === ARTIFACT_TYPES.CODE && (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Play className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCopy}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onExpand}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardHeader>
)
