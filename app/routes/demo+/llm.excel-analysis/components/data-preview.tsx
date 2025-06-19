import { Database, Download, Eye, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { DataPreview, ExcelFileInfo } from '../types'

interface DataPreviewProps {
  fileInfo: ExcelFileInfo
  preview: DataPreview
  onRefresh?: () => void
}

export function DataPreviewComponent({
  fileInfo,
  preview,
  onRefresh,
}: DataPreviewProps) {
  const [viewMode, setViewMode] = useState<'schema' | 'data'>('data')

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number':
        return 'bg-blue-100 text-blue-800'
      case 'string':
        return 'bg-gray-100 text-gray-800'
      case 'date':
        return 'bg-green-100 text-green-800'
      case 'boolean':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatValue = (value: unknown, type: string): string => {
    if (value === null || value === undefined) {
      return ''
    }

    if (type === 'number' && typeof value === 'number') {
      return value.toLocaleString()
    }

    if (type === 'date') {
      try {
        const date = new Date(value as string)
        if (!Number.isNaN(date.getTime())) {
          return date.toLocaleDateString()
        }
      } catch {
        // Fall through to string representation
      }
    }

    return String(value)
  }

  const downloadCSV = () => {
    // Create CSV content
    const headers = preview.schema.columns.map((col) => col.name).join(',')
    const rows = preview.rows
      .map((row) =>
        preview.schema.columns
          .map((col) => {
            const value = row[col.name]
            if (value === null || value === undefined) return ''
            const stringValue = String(value)
            // Escape CSV values that contain commas or quotes
            if (
              stringValue.includes(',') ||
              stringValue.includes('"') ||
              stringValue.includes('\n')
            ) {
              return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
          })
          .join(','),
      )
      .join('\n')

    const csvContent = `${headers}\n${rows}`

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileInfo.name.replace(/\.xlsx?$/i, '')}_preview.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Preview
            </CardTitle>
            <CardDescription>
              {preview.totalRows.toLocaleString()} rows,{' '}
              {preview.schema.columns.length} columns
              {preview.rows.length < preview.totalRows && (
                <span> (showing first {preview.rows.length})</span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'data' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('data')}
            >
              <Eye className="mr-1 h-4 w-4" />
              Data
            </Button>
            <Button
              variant={viewMode === 'schema' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('schema')}
            >
              <Database className="mr-1 h-4 w-4" />
              Schema
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={downloadCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </DropdownMenuItem>
                {onRefresh && (
                  <DropdownMenuItem onClick={onRefresh}>
                    <Database className="mr-2 h-4 w-4" />
                    Refresh
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'schema' ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">File:</span>
                  <Badge variant="outline">{fileInfo.name}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Size:</span>
                  <Badge variant="outline">
                    {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
                {fileInfo.sheets.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Sheets:</span>
                    <Badge variant="outline">{fileInfo.sheets.length}</Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Column Schema</h4>
              <div className="grid gap-2">
                {preview.schema.columns.map((column) => (
                  <div
                    key={column.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{column.name}</span>
                      <Badge className={getTypeColor(column.type)}>
                        {column.type}
                      </Badge>
                      {column.nullable && (
                        <Badge variant="outline" className="text-xs">
                          nullable
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-96 w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {preview.schema.columns.map((column) => (
                    <TableHead key={column.name} className="min-w-[100px]">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{column.name}</span>
                        <Badge
                          className={`text-xs ${getTypeColor(column.type)}`}
                        >
                          {column.type}
                        </Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={preview.schema.columns.length}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  preview.rows.map((row, rowIndex) => (
                    <TableRow key={`row-${rowIndex}`}>
                      {preview.schema.columns.map((column) => (
                        <TableCell key={column.name} className="max-w-[200px]">
                          <div
                            className="truncate"
                            title={String(row[column.name] || '')}
                          >
                            {formatValue(row[column.name], column.type)}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        {preview.rows.length < preview.totalRows && (
          <div className="bg-muted/50 text-muted-foreground mt-4 rounded-lg p-3 text-center text-sm">
            Showing {preview.rows.length} of{' '}
            {preview.totalRows.toLocaleString()} rows. Use the chat interface to
            query the full dataset.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
