import * as duckdb from '@duckdb/duckdb-wasm'
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'

// Use local bundles instead of CDN to avoid CORS issues
const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: new URL(
      '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js',
      import.meta.url,
    ).href,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: new URL(
      '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js',
      import.meta.url,
    ).href,
  },
}

let db: duckdb.AsyncDuckDB | null = null

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

async function initializeDatabase(): Promise<void> {
  try {
    if (db) {
      console.log('[DuckDB Worker] Database already initialized')
      return
    }

    console.log('[DuckDB Worker] Initializing DuckDB WASM...')

    // Select the best bundle from local bundles
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)
    console.log('[DuckDB Worker] Selected bundle:', bundle.mainModule)

    // Create worker
    const worker = new Worker(bundle.mainWorker!)

    // Initialize logger
    const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING)

    // Create database instance
    db = new duckdb.AsyncDuckDB(logger, worker)
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

    // Open database in OPFS
    await db.open({
      path: 'opfs://excel-analysis.db',
      accessMode: duckdb.DuckDBAccessMode.READ_WRITE,
    })

    console.log('[DuckDB Worker] Database initialized successfully')
  } catch (error) {
    console.error('[DuckDB Worker] Initialization failed:', error)
    throw error
  }
}

async function executeQuery(
  sql: string,
): Promise<{ columns: string[]; rows: unknown[][] }> {
  if (!db) {
    throw new Error('Database not initialized')
  }

  try {
    const conn = await db.connect()
    const result = await conn.query(sql)
    await conn.close()

    // Convert result to a simple format
    const data = result.toArray()
    const columns = Object.keys(data[0] || {})
    const rows = data.map((row) => Object.values(row))

    return {
      columns,
      rows,
    }
  } catch (error) {
    console.error('[DuckDB Worker] Query failed:', error)
    throw error
  }
}

async function createTableFromCSV(
  tableName: string,
  csvData: string,
): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized')
  }

  try {
    // Register CSV data as a file buffer
    const csvBuffer = new TextEncoder().encode(csvData)
    await db.registerFileBuffer(`${tableName}.csv`, csvBuffer)

    // Create table from CSV
    const conn = await db.connect()
    await conn.query(
      `CREATE OR REPLACE TABLE "${tableName}" AS SELECT * FROM read_csv('${tableName}.csv', AUTO_DETECT=TRUE)`,
    )
    await conn.close()

    console.log(`[DuckDB Worker] Created table "${tableName}" from CSV data`)
  } catch (error) {
    console.error('[DuckDB Worker] Failed to create table:', error)
    throw error
  }
}

async function closeDatabase(): Promise<void> {
  try {
    if (db) {
      await db.terminate()
      db = null
      console.log('[DuckDB Worker] Database closed')
    }
  } catch (error) {
    console.error('[DuckDB Worker] Failed to close database:', error)
    throw error
  }
}

// Message handler
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data

  try {
    let result:
      | {
          columns?: string[]
          rows?: unknown[][]
          success?: boolean
        }
      | undefined 

    switch (type) {
      case 'init':
        await initializeDatabase()
        break

      case 'query':
        if (!payload?.sql) {
          throw new Error('SQL query is required')
        }
        result = await executeQuery(payload.sql)
        break

      case 'createTable':
        if (!payload?.tableName || !payload?.csvData) {
          throw new Error('Table name and CSV data are required')
        }
        await createTableFromCSV(payload.tableName, payload.csvData)
        result = { success: true }
        break

      case 'close':
        await closeDatabase()
        break

      default:
        throw new Error(`Unknown message type: ${type}`)
    }

    const response: WorkerResponse = {
      id,
      success: true,
      data: result,
    }

    self.postMessage(response)
  } catch (error) {
    const response: WorkerResponse = {
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }

    self.postMessage(response)
  }
}

// Handle worker errors
self.onerror = (error) => {
  console.error('[DuckDB Worker] Unhandled error:', error)
}

self.onunhandledrejection = (error) => {
  console.error('[DuckDB Worker] Unhandled promise rejection:', error)
}

console.log('[DuckDB Worker] Worker script loaded')
