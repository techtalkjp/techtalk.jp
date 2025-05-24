import { BarChart3, Code, FileText, Image } from 'lucide-react'
import { ARTIFACT_TYPES } from '../types/artifact'

export const ArtifactIcon = ({
  type,
}: {
  type: keyof typeof ARTIFACT_TYPES
}) => {
  const iconMap = {
    [ARTIFACT_TYPES.CODE]: Code,
    [ARTIFACT_TYPES.DOCUMENT]: FileText,
    [ARTIFACT_TYPES.HTML]: Image,
    [ARTIFACT_TYPES.CHART]: BarChart3,
  }

  const IconComponent = iconMap[type] || FileText
  return <IconComponent className="h-4 w-4" />
}
