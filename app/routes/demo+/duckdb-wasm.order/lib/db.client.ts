import { DuckDbDialect } from '@coji/kysely-duckdb-wasm'
import * as duckdb from '@duckdb/duckdb-wasm'
import ehWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'
import mvpWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdbWasmEh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import duckdbWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import { Kysely } from 'kysely'
import type { DB } from './db-schema'

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdbWasm,
    mainWorker: mvpWorker,
  },
  eh: {
    mainModule: duckdbWasmEh,
    mainWorker: ehWorker,
  },
}

const DB_PATH = 'opfs://demo/order.db'
const config = {
  path: DB_PATH,
  accessMode: duckdb.DuckDBAccessMode.READ_WRITE,
} satisfies duckdb.DuckDBConfig

let dbPromise: Promise<Kysely<DB>> | null = null
let dbInstance: Kysely<DB> | null = null
let duck: duckdb.AsyncDuckDB | null = null
let worker: Worker | null = null

async function initDB(): Promise<Kysely<DB>> {
  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)
  if (!bundle.mainWorker) {
    throw new Error('No duckdb worker found in the bundle.')
  }

  worker = new Worker(bundle.mainWorker)
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
  dbPromise = null
}
