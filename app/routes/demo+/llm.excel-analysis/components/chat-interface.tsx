import { BarChart3, Bot, Database, Loader2, Send, User } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { DuckDBClient } from '../services/duckdb-client'
import type { ChartConfig, DataSchema } from '../types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sql?: string
  queryResult?: {
    columns: string[]
    rows: unknown[][]
  }
  chartConfig?: ChartConfig
  timestamp: Date
}

interface ChatInterfaceProps {
  schema: DataSchema
  tableName: string
  onChartGenerated?: (chartConfig: ChartConfig, data: unknown[][]) => void
}

export function ChatInterface({
  schema,
  tableName,
  onChartGenerated,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm ready to help you analyze your data. Your table "${tableName}" has ${schema.rowCount} rows and ${schema.columns.length} columns. You can ask me questions like:

• "Show me the first 10 rows"
• "What are the column names and types?"
• "Find the top 5 values by [column name]"
• "Create a chart showing [data relationship]"
• "Calculate the average of [numeric column]"

What would you like to explore?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const duckdbClient = DuckDBClient.getInstance()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  })

  const generateSQL = async (
    query: string,
  ): Promise<{
    sql: string
    explanation: string
    chartConfig?: ChartConfig
  }> => {
    // This would typically call your LLM API
    // For now, we'll implement some basic pattern matching
    const lowerQuery = query.toLowerCase()

    // Sample SQL generation based on common patterns
    if (lowerQuery.includes('first') || lowerQuery.includes('top')) {
      const limitMatch = query.match(/(\d+)/)
      const limit = limitMatch ? limitMatch[1] : '10'
      return {
        sql: `SELECT * FROM "${tableName}" LIMIT ${limit}`,
        explanation: `Showing the first ${limit} rows from your data.`,
      }
    }

    if (lowerQuery.includes('count') || lowerQuery.includes('how many')) {
      return {
        sql: `SELECT COUNT(*) as total_rows FROM "${tableName}"`,
        explanation: 'Counting the total number of rows in your dataset.',
      }
    }

    if (lowerQuery.includes('column') || lowerQuery.includes('schema')) {
      return {
        sql: `DESCRIBE "${tableName}"`,
        explanation:
          'Showing the column structure and data types of your table.',
      }
    }

    if (lowerQuery.includes('average') || lowerQuery.includes('avg')) {
      const numericColumns = schema.columns.filter(
        (col) => col.type === 'number',
      )
      if (numericColumns.length > 0) {
        const avgColumns = numericColumns
          .map((col) => `AVG("${col.name}") as avg_${col.name}`)
          .join(', ')
        return {
          sql: `SELECT ${avgColumns} FROM "${tableName}"`,
          explanation: 'Calculating the average values for numeric columns.',
        }
      }
    }

    if (
      lowerQuery.includes('chart') ||
      lowerQuery.includes('graph') ||
      lowerQuery.includes('visualize')
    ) {
      const numericColumns = schema.columns.filter(
        (col) => col.type === 'number',
      )
      const stringColumns = schema.columns.filter(
        (col) => col.type === 'string',
      )

      if (numericColumns.length > 0 && stringColumns.length > 0) {
        const groupBy = stringColumns[0]?.name
        const measure = numericColumns[0]?.name
        if (groupBy && measure) {
          return {
            sql: `SELECT "${groupBy}", COUNT(*) as count, AVG("${measure}") as avg_${measure} FROM "${tableName}" GROUP BY "${groupBy}" ORDER BY count DESC LIMIT 10`,
            explanation: `Creating a chart showing the distribution of ${groupBy} with average ${measure}.`,
            chartConfig: {
              type: 'bar',
              xAxis: groupBy,
              yAxis: ['count', `avg_${measure}`],
              title: `${groupBy} Distribution`,
              description: `Distribution of ${groupBy} with average ${measure}`,
            },
          }
        }
      }
    }

    // Default fallback - try to execute the query as-is if it looks like SQL
    if (lowerQuery.includes('select') || lowerQuery.includes('from')) {
      return {
        sql: query,
        explanation: 'Executing your custom SQL query.',
      }
    }

    // If we can't understand the query, suggest some options
    const suggestions = [
      `SELECT * FROM "${tableName}" LIMIT 10`,
      `SELECT COUNT(*) FROM "${tableName}"`,
      `DESCRIBE "${tableName}"`,
    ]

    return {
      sql: suggestions[0] || `SELECT * FROM "${tableName}" LIMIT 10`,
      explanation: `I couldn't understand your query. Here are some suggestions you can try:\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Generate SQL from natural language
      const { sql, explanation, chartConfig } = await generateSQL(inputValue)

      // Execute the SQL query
      const queryResult = await duckdbClient.executeQuery(sql)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: explanation,
        sql,
        queryResult,
        chartConfig,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // If we have chart config and suitable data, notify parent
      if (chartConfig && queryResult.rows.length > 0 && onChartGenerated) {
        onChartGenerated(chartConfig, queryResult.rows)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try rephrasing your question or check your query syntax.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatQueryResult = (result: {
    columns: string[]
    rows: unknown[][]
  }) => {
    if (result.rows.length === 0) {
      return 'No results found.'
    }

    // For small results, show as table
    if (result.rows.length <= 10 && result.columns.length <= 5) {
      const headerRow = result.columns.join(' | ')
      const separator = result.columns.map(() => '---').join(' | ')
      const dataRows = result.rows
        .map((row) => row.map((cell) => cell?.toString() || '').join(' | '))
        .join('\n')

      return `\`\`\`\n${headerRow}\n${separator}\n${dataRows}\n\`\`\``
    }

    // For larger results, show summary
    return `Query returned ${result.rows.length} rows and ${result.columns.length} columns.\n\nColumns: ${result.columns.join(', ')}\n\nFirst few rows shown in the table below.`
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Data Analysis
        </CardTitle>
        <CardDescription>
          Ask questions about your data in natural language. I'll generate SQL
          queries and provide insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ScrollArea className="mb-4 flex-1" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.sql && (
                      <div className="mt-2 rounded bg-black/10 p-2 font-mono text-sm">
                        <div className="mb-1 flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          <span className="text-xs">SQL Query:</span>
                        </div>
                        <code>{message.sql}</code>
                      </div>
                    )}
                    {message.chartConfig && (
                      <div className="mt-2">
                        <Badge variant="outline" className="gap-1">
                          <BarChart3 className="h-3 w-3" />
                          Chart generated
                        </Badge>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                      <User className="text-primary-foreground h-4 w-4" />
                    </div>
                  )}
                </div>

                {message.queryResult && (
                  <div className="ml-11">
                    <Alert>
                      <Database className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p>{formatQueryResult(message.queryResult)}</p>
                          {message.queryResult.rows.length > 0 && (
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse border border-gray-300 text-sm">
                                <thead>
                                  <tr className="bg-gray-50">
                                    {message.queryResult.columns.map((col) => (
                                      <th
                                        key={col}
                                        className="border border-gray-300 px-2 py-1 text-left"
                                      >
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {message.queryResult.rows
                                    .slice(0, 5)
                                    .map((row, i) => (
                                      <tr key={`row-${i}`}>
                                        {row.map((cell, j) => (
                                          <td
                                            key={`cell-${i}-${j}`}
                                            className="border border-gray-300 px-2 py-1"
                                          >
                                            {cell?.toString() || ''}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                              {message.queryResult.rows.length > 5 && (
                                <p className="text-muted-foreground mt-1 text-xs">
                                  ... and {message.queryResult.rows.length - 5}{' '}
                                  more rows
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing your question...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your data..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="text-muted-foreground mt-2 text-xs">
          <p>
            Try asking: "Show me the first 10 rows" or "Create a chart showing
            the distribution"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
