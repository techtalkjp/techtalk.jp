import type { ColumnType } from 'kysely'

// Helpers for column typing
type TSDefault = ColumnType<string, string | undefined, string | undefined>
type NullableTS = ColumnType<
  string | null,
  string | null | undefined,
  string | null | undefined
>
type NullableText = ColumnType<
  string | null,
  string | null | undefined,
  string | null | undefined
>

export type DB = {
  sample_orders: {
    id: string
    region: string
    name: string
    email: string
    zip: string
    country: string
    prefecture: string
    city: string
    address: string
    phone: string
    note: string
    updated_at: TSDefault
    created_at: TSDefault
  }
  sync_state: {
    scope: string
    last_synced_at: NullableTS
    last_cursor: NullableText
    updated_at: TSDefault
    created_at: TSDefault
  }
  sync_job: {
    run_id: string
    scope: string
    status: 'running' | 'success' | 'error'
    started_at: TSDefault
    heartbeat_at: NullableTS
    finished_at: NullableTS
    from_synced_at: NullableTS
    from_cursor: NullableText
    progress_synced_at: NullableTS
    progress_cursor: NullableText
    error: NullableText
    updated_at: TSDefault
    created_at: TSDefault
  }
}
