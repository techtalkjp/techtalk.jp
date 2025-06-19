import { BarChart3, Database, MessageSquare, Upload } from 'lucide-react'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { ChartGenerator } from './components/chart-generator'
import { ChatInterface } from './components/chat-interface'
import { DataPreviewComponent } from './components/data-preview'
import { ExcelUploader } from './components/excel-uploader'
import type { ChartConfig, DataPreview, ExcelFileInfo } from './types'

export default function ExcelAnalysisDemo() {
  const [activeTab, setActiveTab] = useState('upload')
  const [fileInfo, setFileInfo] = useState<ExcelFileInfo | null>(null)
  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedChart, setGeneratedChart] = useState<{
    config: ChartConfig
    data: unknown[][]
    columns: string[]
  } | null>(null)

  const handleFileProcessed = (info: ExcelFileInfo, preview: DataPreview) => {
    setFileInfo(info)
    setDataPreview(preview)
    setError(null)
    setActiveTab('data')
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleChartGenerated = (
    chartConfig: ChartConfig,
    data: unknown[][],
  ) => {
    if (dataPreview) {
      setGeneratedChart({
        config: chartConfig,
        data,
        columns: dataPreview.schema.columns.map((col) => col.name),
      })
      setActiveTab('charts')
    }
  }

  const getTableName = () => {
    if (!fileInfo) return ''
    return fileInfo.name.replace(/\.xlsx?$/i, '').replace(/[^a-zA-Z0-9_]/g, '_')
  }

  return (
    <Stack className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Excel Analysis with LLM</h1>
        <p className="text-muted-foreground">
          Upload Excel files to OPFS, analyze with DuckDB WASM, and get insights
          using AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Charts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Stack>
            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="text-destructive flex items-center gap-2">
                    <span className="font-medium">Error:</span>
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            <ExcelUploader
              onFileProcessed={handleFileProcessed}
              onError={handleError}
            />
          </Stack>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          {fileInfo && dataPreview ? (
            <DataPreviewComponent fileInfo={fileInfo} preview={dataPreview} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  View your Excel data and automatically detected schema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground py-8 text-center">
                  <Database className="mx-auto mb-4 h-12 w-12" />
                  <p>Upload an Excel file to see data preview</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          {dataPreview ? (
            <ChatInterface
              schema={dataPreview.schema}
              tableName={getTableName()}
              onChartGenerated={handleChartGenerated}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Ask questions about your data in natural language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground py-8 text-center">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12" />
                  <p>Load data to start asking questions</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          {generatedChart ? (
            <ChartGenerator
              chartConfig={generatedChart.config}
              data={generatedChart.data}
              columns={generatedChart.columns}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Visualizations</CardTitle>
                <CardDescription>
                  AI-generated charts and graphs based on your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground py-8 text-center">
                  <BarChart3 className="mx-auto mb-4 h-12 w-12" />
                  <p>
                    Ask for a chart in the Analysis tab to generate
                    visualizations
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Stack>
  )
}
