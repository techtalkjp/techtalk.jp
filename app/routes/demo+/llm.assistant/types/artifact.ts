/**
 * アーティファクトのタイプ定義
 */
export const ARTIFACT_TYPES = {
  CODE: 'CODE',
  DOCUMENT: 'DOCUMENT',
  HTML: 'HTML',
  CHART: 'CHART',
} as const

export type ArtifactType = (typeof ARTIFACT_TYPES)[keyof typeof ARTIFACT_TYPES]

/**
 * プログラミング言語の定義
 */
export const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  PYTHON: 'python',
  JAVA: 'java',
  CPP: 'cpp',
  GO: 'go',
  RUST: 'rust',
  HTML: 'html',
  CSS: 'css',
  JSON: 'json',
  MARKDOWN: 'markdown',
} as const

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES]

/**
 * 基本的なアーティファクト構造
 */
export interface BaseArtifact {
  id: string
  type: ArtifactType
  title: string
  description?: string
  content: string
  createdAt: Date
  updatedAt?: Date
}

/**
 * コードアーティファクト
 */
export interface CodeArtifact extends BaseArtifact {
  type: typeof ARTIFACT_TYPES.CODE
  language: SupportedLanguage
  dependencies?: string[]
  executable?: boolean
}

/**
 * HTMLアーティファクト
 */
export interface HtmlArtifact extends BaseArtifact {
  type: typeof ARTIFACT_TYPES.HTML
  css?: string
  javascript?: string
  preview?: boolean
}

/**
 * ドキュメントアーティファクト
 */
export interface DocumentArtifact extends BaseArtifact {
  type: typeof ARTIFACT_TYPES.DOCUMENT
  format: 'markdown' | 'plain' | 'rich'
  wordCount?: number
}

/**
 * チャートアーティファクト
 */
export interface ChartArtifact extends BaseArtifact {
  type: typeof ARTIFACT_TYPES.CHART
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'area'
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: Record<string, any>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  config?: Record<string, any>
}

/**
 * 全てのアーティファクトタイプのユニオン
 */
export type Artifact =
  | CodeArtifact
  | HtmlArtifact
  | DocumentArtifact
  | ChartArtifact
