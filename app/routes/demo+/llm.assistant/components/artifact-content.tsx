import { CardContent } from '~/components/ui'
import { ARTIFACT_TYPES, type Artifact } from '../types/artifact'
import { ChartArtifact } from './artifacts/chart'
import { CodeArtifact } from './artifacts/code'
import { DocumentArtifact } from './artifacts/document'
import { HtmlArtifact } from './artifacts/html'

export const ArtifactContent = ({
  artifact,
  isExpanded,
}: {
  artifact: Artifact
  isExpanded: boolean
}) => {
  const renderContent = () => {
    switch (artifact.type) {
      case ARTIFACT_TYPES.CODE:
        return <CodeArtifact content={artifact.content} />
      case ARTIFACT_TYPES.HTML:
        return (
          <HtmlArtifact content={artifact.content} title={artifact.title} />
        )
      case ARTIFACT_TYPES.DOCUMENT:
        return <DocumentArtifact content={artifact.content} />
      case ARTIFACT_TYPES.CHART:
        return <ChartArtifact title={artifact.title} />
      default:
        // Fallback for unsupported artifact types
        return (
          <div className="text-muted-foreground">
            This artifact type is not supported.
          </div>
        )
    }
  }

  return (
    <CardContent
      className={`pt-3 ${isExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}
    >
      {renderContent()}
    </CardContent>
  )
}
