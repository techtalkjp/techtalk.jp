import { Migrator, type Migration } from 'kysely'
import { getDB } from './db.client'
import { migrations } from './migrations'

type NamedMigartion = Migration & { name: string }

/**
 * 配列からマイグレーションを提供するクラス
 * Kysely の Migrator で使用する
 * @see https://kysely.dev/reference/migrations#migration-provider
 */
class ArrayProvider {
  constructor(private readonly list: NamedMigartion[]) {}
  // biome-ignore lint/suspicious/useAwait: async without await
  async getMigrations(): Promise<Record<string, Migration>> {
    return Object.fromEntries(this.list.map((m) => [m.name, m]))
  }
}

let once: Promise<void> | null = null

/**
 * DB マイグレーションを実行
 */
const run = async () => {
  const db = await getDB()
  const migrator = new Migrator({
    db,
    provider: new ArrayProvider(migrations),
  })
  const { error, results } = await migrator.migrateToLatest()
  if (error) throw error
  for (const r of results ?? []) {
    console.info(`${r.status === 'Success' ? '✅' : '…'} ${r.migrationName}`)
  }
}

/**
 * DB マイグレーションを一度だけ実行して、完了まで待つ
 * @returns マイグレーション完了を待つ Promise
 */
// biome-ignore lint/suspicious/useAwait: single-flight
export async function migrateToLatestOnce() {
  if (!once) {
    // TODO: 複数タブ対策
    once = run()
  }

  return once
}
