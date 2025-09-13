import { DuckDbDialect } from '@coji/kysely-duckdb-wasm'
import * as duckdb from '@duckdb/duckdb-wasm'
import { Kysely } from 'kysely'
import type { DB } from './db-schema'

const DB_PATH = 'opfs://demo/order.db'
const config = {
  path: DB_PATH,
  accessMode: duckdb.DuckDBAccessMode.READ_WRITE,
} satisfies duckdb.DuckDBConfig

let dbPromise: Promise<Kysely<DB>> | null = null
let dbInstance: Kysely<DB> | null = null
let duck: duckdb.AsyncDuckDB | null = null
let worker: Worker | null = null
let workerBlobUrl: string | null = null

async function initDB(): Promise<Kysely<DB>> {
  // Use CDN bundles but fetch and create blob URL for Worker to avoid CORS issues
  const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles())
  if (!bundle.mainWorker) {
    throw new Error('No duckdb worker found in the bundle.')
  }

  // Fetch the worker script and create a blob URL to bypass CORS restrictions
  const workerResponse = await fetch(bundle.mainWorker)
  const workerBlob = await workerResponse.blob()
  workerBlobUrl = URL.createObjectURL(workerBlob)

  worker = new Worker(workerBlobUrl)
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.ERROR)
  duck = new duckdb.AsyncDuckDB(logger, worker)
  // Use pthread worker argument if available (do not pass mainWorker here)
  await duck.instantiate(bundle.mainModule, bundle.pthreadWorker)
  await duck.open(config)

  dbInstance = new Kysely<DB>({
    dialect: new DuckDbDialect({
      database: duck,
      tableMappings: {},
    }),
  })

  return dbInstance
}

// biome-ignore lint/suspicious/useAwait: single-flight init
export const getDB = async () => {
  if (!dbPromise) {
    dbPromise = initDB().catch((err) => {
      // Reset promise on failure so next call can retry
      dbPromise = null
      throw err
    })
  }
  return dbPromise
}

export const disposeDB = async () => {
  try {
    if (dbInstance) {
      await dbInstance.destroy()
    }
  } finally {
    dbInstance = null
  }
  try {
    if (duck) {
      await duck.terminate()
    }
  } finally {
    duck = null
  }
  try {
    if (worker) {
      worker.terminate()
    }
  } finally {
    worker = null
  }
  try {
    if (workerBlobUrl) {
      URL.revokeObjectURL(workerBlobUrl)
    }
  } finally {
    workerBlobUrl = null
  }
  dbPromise = null
}
