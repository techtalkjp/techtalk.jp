import * as XLSX from 'xlsx'
import type { DataPreview, DataSchema, ExcelFileInfo } from '../types'

export class ExcelProcessor {
  private static instance: ExcelProcessor

  static getInstance(): ExcelProcessor {
    if (!ExcelProcessor.instance) {
      ExcelProcessor.instance = new ExcelProcessor()
    }
    return ExcelProcessor.instance
  }

  processExcelFile(
    fileData: ArrayBuffer,
    fileName: string,
    sheetName?: string,
  ): {
    csvData: string
    preview: DataPreview
    fileInfo: ExcelFileInfo
  } {
    try {
      const workbook = XLSX.read(fileData, { type: 'array' })
      const sheets = workbook.SheetNames

      if (sheets.length === 0) {
        throw new Error('No sheets found in Excel file')
      }

      const targetSheetName = sheetName || sheets[0]
      if (!targetSheetName || !sheets.includes(targetSheetName)) {
        throw new Error(`Sheet "${targetSheetName}" not found`)
      }

      const worksheet = workbook.Sheets[targetSheetName]
      if (!worksheet) {
        throw new Error(`Failed to read worksheet: ${targetSheetName}`)
      }

      // Convert to JSON for processing
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
        blankrows: false,
      }) as unknown[][]

      if (jsonData.length === 0) {
        throw new Error('Sheet is empty')
      }

      // Extract headers (first row)
      const headers = jsonData[0] as string[]
      const dataRows = jsonData.slice(1)

      // Clean headers
      const cleanHeaders = headers.map((header, index) =>
        header && typeof header === 'string'
          ? header.trim() || `Column_${index + 1}`
          : `Column_${index + 1}`,
      )

      // Detect column types
      const schema = this.detectSchema(cleanHeaders, dataRows)

      // Convert to CSV
      const csvData = this.convertToCSV(cleanHeaders, dataRows)

      // Create preview data
      const previewRows = dataRows.slice(0, 100).map((row) => {
        const rowObj: Record<string, unknown> = {}
        cleanHeaders.forEach((header, index) => {
          rowObj[header] = row[index] ?? null
        })
        return rowObj
      })

      const preview: DataPreview = {
        schema,
        rows: previewRows,
        totalRows: dataRows.length,
      }

      const fileInfo: ExcelFileInfo = {
        name: fileName,
        size: fileData.byteLength,
        lastModified: Date.now(),
        sheets,
      }

      console.log(
        `[Excel] Processed ${fileName}: ${dataRows.length} rows, ${cleanHeaders.length} columns`,
      )

      return { csvData, preview, fileInfo }
    } catch (error) {
      console.error('[Excel] Processing failed:', error)
      throw new Error(
        `Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  private detectSchema(headers: string[], rows: unknown[][]): DataSchema {
    const columns = headers.map((name, index) => {
      const columnValues = rows
        .map((row) => row[index])
        .filter(
          (value) => value !== null && value !== undefined && value !== '',
        )

      const type = this.detectColumnType(columnValues)
      const nullable = rows.some((row) => {
        const value = row[index]
        return value === null || value === undefined || value === ''
      })

      return { name, type, nullable }
    })

    return {
      columns,
      rowCount: rows.length,
    }
  }

  private detectColumnType(
    values: unknown[],
  ): 'string' | 'number' | 'date' | 'boolean' {
    if (values.length === 0) return 'string'

    // Check for boolean
    const booleanValues = values.filter(
      (value) =>
        typeof value === 'boolean' ||
        (typeof value === 'string' && /^(true|false|yes|no|0|1)$/i.test(value)),
    )
    if (booleanValues.length / values.length > 0.8) return 'boolean'

    // Check for numbers
    const numberValues = values.filter((value) => {
      if (typeof value === 'number') return true
      if (typeof value === 'string') {
        const num = Number.parseFloat(value.replace(/[,$%]/g, ''))
        return !Number.isNaN(num) && Number.isFinite(num)
      }
      return false
    })
    if (numberValues.length / values.length > 0.8) return 'number'

    // Check for dates
    const dateValues = values.filter((value) => {
      if (value instanceof Date) return true
      if (typeof value === 'string') {
        const date = new Date(value)
        return !Number.isNaN(date.getTime())
      }
      if (typeof value === 'number') {
        // Excel serial date number
        try {
          const date = XLSX.SSF.parse_date_code(value)
          return date && date instanceof Date && !Number.isNaN(date.getTime())
        } catch {
          return false
        }
      }
      return false
    })
    if (dateValues.length / values.length > 0.6) return 'date'

    return 'string'
  }

  private convertToCSV(headers: string[], rows: unknown[][]): string {
    const csvRows: string[] = []

    // Add headers
    csvRows.push(headers.map((header) => this.escapeCsvValue(header)).join(','))

    // Add data rows
    for (const row of rows) {
      const csvRow = headers
        .map((_, index) => {
          const value = row[index]
          return this.escapeCsvValue(value)
        })
        .join(',')
      csvRows.push(csvRow)
    }

    return csvRows.join('\n')
  }

  private escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) return ''

    const stringValue = String(value)

    // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
    if (
      stringValue.includes(',') ||
      stringValue.includes('\n') ||
      stringValue.includes('"')
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
  }

  getSheetNames(fileData: ArrayBuffer): string[] {
    try {
      const workbook = XLSX.read(fileData, { type: 'array' })
      return workbook.SheetNames
    } catch (error) {
      console.error('[Excel] Failed to get sheet names:', error)
      throw new Error('Failed to read Excel file')
    }
  }

  validateExcelFile(file: File): { valid: boolean; error?: string } {
    // Check file extension
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return {
        valid: false,
        error: 'Please select an Excel file (.xlsx or .xls)',
      }
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' }
    }

    // Check MIME type
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ]

    if (file.type && !validMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please select an Excel file.',
      }
    }

    return { valid: true }
  }
}
