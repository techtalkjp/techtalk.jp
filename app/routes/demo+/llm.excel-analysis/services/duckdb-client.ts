import type { DatabaseState, DataSchema } from '../types'

interface WorkerMessage {
  id: string
  type: 'init' | 'query' | 'createTable' | 'close'
  payload?: {
    sql?: string
    tableName?: string
    csvData?: string
  }
}

interface WorkerResponse {
  id: string
  success: boolean
  data?: {
    columns?: string[]
    rows?: unknown[][]
    success?: boolean
  }
  error?: string
}

export class DuckDBClient {
  private static instance: DuckDBClient
  private worker: Worker | null = null
  private messageId = 0
  private pendingMessages = new Map<
    string,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >()
  private isInitialized = false

  static getInstance(): DuckDBClient {
    if (!DuckDBClient.instance) {
      DuckDBClient.instance = new DuckDBClient()
    }
    return DuckDBClient.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    try {
      // Create worker - we'll need to update this path to the built worker
      this.worker = new Worker(
        new URL('../workers/duckdb-worker.ts', import.meta.url),
        {
          type: 'module',
        },
      )

      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { id, success, data, error } = event.data
        const pending = this.pendingMessages.get(id)

        if (pending) {
          this.pendingMessages.delete(id)
          if (success) {
            pending.resolve(data)
          } else {
            pending.reject(new Error(error || 'Unknown worker error'))
          }
        }
      }

      this.worker.onerror = (error) => {
        console.error('[DuckDB Client] Worker error:', error)
        // Reject all pending messages
        for (const { reject } of this.pendingMessages.values()) {
          reject(new Error('Worker error'))
        }
        this.pendingMessages.clear()
      }

      // Initialize the database
      await this.sendMessage('init')
      this.isInitialized = true

      console.log('[DuckDB Client] Initialized successfully')
    } catch (error) {
      console.error('[DuckDB Client] Initialization failed:', error)
      throw new Error(
        `Failed to initialize DuckDB: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  private sendMessage(
    type: 'init' | 'query' | 'createTable' | 'close',
    payload?: WorkerMessage['payload'],
  ): Promise<unknown> {
    if (!this.worker) {
      throw new Error('Worker not initialized')
    }

    const id = `msg_${++this.messageId}`
    const message: WorkerMessage = { id, type, payload }

    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, { resolve, reject })
      this.worker!.postMessage(message)

      // Add timeout to prevent hanging
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id)
          reject(new Error(`Worker message timeout: ${type}`))
        }
      }, 30000) // 30 second timeout
    })
  }

  async createTableFromCSV(tableName: string, csvData: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      await this.sendMessage('createTable', { tableName, csvData })
      console.log(`[DuckDB Client] Created table: ${tableName}`)
    } catch (error) {
      console.error('[DuckDB Client] Failed to create table:', error)
      throw new Error(
        `Failed to create table: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async executeQuery(
    sql: string,
  ): Promise<{ columns: string[]; rows: unknown[][] }> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const result = (await this.sendMessage('query', { sql })) as {
        columns: string[]
        rows: unknown[][]
      }
      return result
    } catch (error) {
      console.error('[DuckDB Client] Query failed:', error)
      throw new Error(
        `Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async getTableInfo(tableName: string): Promise<DataSchema> {
    try {
      const result = await this.executeQuery(`DESCRIBE "${tableName}"`)

      const columns = result.rows.map((row) => ({
        name: row[0] as string,
        type: this.mapDuckDBType(row[1] as string),
        nullable: (row[2] as string).toLowerCase() === 'yes',
      }))

      const countResult = await this.executeQuery(
        `SELECT COUNT(*) FROM "${tableName}"`,
      )
      const rowCount = (countResult.rows[0]?.[0] as number) || 0

      return { columns, rowCount }
    } catch (error) {
      console.error('[DuckDB Client] Failed to get table info:', error)
      throw new Error(
        `Failed to get table info: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  private mapDuckDBType(
    duckdbType: string,
  ): 'string' | 'number' | 'date' | 'boolean' {
    const type = duckdbType.toLowerCase()

    if (
      type.includes('varchar') ||
      type.includes('text') ||
      type.includes('string')
    ) {
      return 'string'
    }
    if (
      type.includes('int') ||
      type.includes('double') ||
      type.includes('float') ||
      type.includes('decimal')
    ) {
      return 'number'
    }
    if (type.includes('date') || type.includes('timestamp')) {
      return 'date'
    }
    if (type.includes('bool')) {
      return 'boolean'
    }

    return 'string' // default
  }

  async listTables(): Promise<string[]> {
    try {
      const result = await this.executeQuery('SHOW TABLES')
      return result.rows.map((row) => row[0] as string)
    } catch (error) {
      console.error('[DuckDB Client] Failed to list tables:', error)
      return []
    }
  }

  async getTablePreview(
    tableName: string,
    limit = 100,
  ): Promise<{ columns: string[]; rows: unknown[][] }> {
    try {
      return await this.executeQuery(
        `SELECT * FROM "${tableName}" LIMIT ${limit}`,
      )
    } catch (error) {
      console.error('[DuckDB Client] Failed to get table preview:', error)
      throw new Error(
        `Failed to get table preview: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async getDatabaseState(): Promise<DatabaseState> {
    try {
      const tables = await this.listTables()
      let totalRows = 0

      for (const table of tables) {
        try {
          const result = await this.executeQuery(
            `SELECT COUNT(*) FROM "${table}"`,
          )
          totalRows += (result.rows[0]?.[0] as number) || 0
        } catch (error) {
          console.warn(
            `[DuckDB Client] Failed to count rows in ${table}:`,
            error,
          )
        }
      }

      return {
        isInitialized: this.isInitialized,
        tables,
        totalRows,
      }
    } catch (error) {
      console.error('[DuckDB Client] Failed to get database state:', error)
      return {
        isInitialized: false,
        tables: [],
        totalRows: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async close(): Promise<void> {
    try {
      if (this.worker) {
        await this.sendMessage('close')
        this.worker.terminate()
        this.worker = null
      }
      this.isInitialized = false
      this.pendingMessages.clear()
      console.log('[DuckDB Client] Closed successfully')
    } catch (error) {
      console.error('[DuckDB Client] Failed to close:', error)
    }
  }

  // Cleanup method for component unmount
  cleanup(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.isInitialized = false
    this.pendingMessages.clear()
  }
}
