import { CheckCircle2, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import type React from 'react'
import { useCallback, useState } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { DuckDBClient } from '../services/duckdb-client'
import { ExcelProcessor } from '../services/excel-processor'
import { OPFSManager } from '../services/opfs-manager'
import type { DataPreview, ExcelFileInfo } from '../types'

interface ExcelUploaderProps {
  onFileProcessed: (fileInfo: ExcelFileInfo, preview: DataPreview) => void
  onError: (error: string) => void
}

export function ExcelUploader({
  onFileProcessed,
  onError,
}: ExcelUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [processedFile, setProcessedFile] = useState<ExcelFileInfo | null>(null)

  const opfsManager = OPFSManager.getInstance()
  const excelProcessor = ExcelProcessor.getInstance()
  const duckdbClient = DuckDBClient.getInstance()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setIsProcessing(true)
        setProgress(0)
        setCurrentStep('Validating file...')

        // Validate file
        const validation = excelProcessor.validateExcelFile(file)
        if (!validation.valid) {
          throw new Error(validation.error)
        }

        setProgress(10)
        setCurrentStep('Initializing OPFS...')

        // Initialize OPFS
        await opfsManager.initialize()

        setProgress(20)
        setCurrentStep('Reading Excel file...')

        // Read file as ArrayBuffer
        const fileData = await file.arrayBuffer()

        setProgress(40)
        setCurrentStep('Processing Excel data...')

        // Process Excel file
        const { csvData, preview, fileInfo } =
          await excelProcessor.processExcelFile(fileData, file.name)

        setProgress(60)
        setCurrentStep('Saving to OPFS...')

        // Save original file and processed CSV to OPFS
        await opfsManager.saveExcelFile(file.name, fileData)
        await opfsManager.saveProcessedData(file.name, csvData)

        setProgress(80)
        setCurrentStep('Loading into database...')

        // Initialize DuckDB and create table
        await duckdbClient.initialize()
        const tableName = file.name
          .replace(/\.xlsx?$/i, '')
          .replace(/[^a-zA-Z0-9_]/g, '_')
        await duckdbClient.createTableFromCSV(tableName, csvData)

        setProgress(100)
        setCurrentStep('Complete!')

        setProcessedFile(fileInfo)
        onFileProcessed(fileInfo, preview)

        setTimeout(() => {
          setIsProcessing(false)
          setCurrentStep('')
          setProgress(0)
        }, 1000)
      } catch (error) {
        console.error('[ExcelUploader] Processing failed:', error)
        setIsProcessing(false)
        setProgress(0)
        setCurrentStep('')
        onError(
          error instanceof Error ? error.message : 'Unknown error occurred',
        )
      }
    },
    [
      duckdbClient.createTableFromCSV,
      duckdbClient.initialize,
      excelProcessor.processExcelFile,
      excelProcessor.validateExcelFile,
      onError,
      onFileProcessed,
      opfsManager.initialize,
      opfsManager.saveExcelFile,
      opfsManager.saveProcessedData,
    ],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0 && files[0]) {
        handleFile(files[0])
      }
    },
    [handleFile],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0 && files[0]) {
        handleFile(files[0])
      }
    },
    [handleFile],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Excel File
        </CardTitle>
        <CardDescription>
          Drag and drop your Excel file to store it in OPFS and analyze with
          DuckDB WASM
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isProcessing && !processedFile && (
          // biome-ignore lint/a11y/noStaticElementInteractions: div
          // biome-ignore lint/a11y/useAriaPropsSupportedByRole: div
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            } `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('excel-file-input')?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                document.getElementById('excel-file-input')?.click()
              }
            }}
            aria-label="Click to select Excel file"
          >
            <FileSpreadsheet className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="mb-2 text-lg font-medium">
              {isDragOver
                ? 'Drop your Excel file here'
                : 'Drop your Excel file here'}
            </p>
            <p className="text-muted-foreground mb-4 text-sm">
              Supports .xlsx files up to 10MB
            </p>
            <Button variant="outline">Choose File</Button>
            <input
              id="excel-file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">{currentStep}</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-muted-foreground text-xs">
              Processing may take a moment for large files...
            </p>
          </div>
        )}

        {processedFile && !isProcessing && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Successfully processed <strong>{processedFile.name}</strong>
              {processedFile.sheets.length > 1 && (
                <span> ({processedFile.sheets.length} sheets detected)</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-muted-foreground space-y-1 text-xs">
          <p>
            <strong>Supported formats:</strong> .xlsx, .xls
          </p>
          <p>
            <strong>Maximum file size:</strong> 10MB
          </p>
          <p>
            <strong>Storage:</strong> Files are stored in your browser's Origin
            Private File System (OPFS)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
