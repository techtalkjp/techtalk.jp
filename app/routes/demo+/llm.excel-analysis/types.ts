export interface ExcelFileInfo {
  name: string
  size: number
  lastModified: number
  sheets: string[]
}

export interface DataSchema {
  columns: Array<{
    name: string
    type: 'string' | 'number' | 'date' | 'boolean'
    nullable: boolean
  }>
  rowCount: number
}

export interface DataPreview {
  schema: DataSchema
  rows: Record<string, unknown>[]
  totalRows: number
}

export interface AnalysisRequest {
  query: string
  context?: {
    availableTables: string[]
    schema: DataSchema
  }
}

export interface AnalysisResponse {
  sql?: string
  result?: {
    columns: string[]
    rows: unknown[][]
  }
  explanation: string
  chartConfig?: ChartConfig
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area'
  xAxis?: string
  yAxis?: string[]
  title?: string
  description?: string
}

export interface DatabaseState {
  isInitialized: boolean
  tables: string[]
  totalRows: number
  error?: string
}
