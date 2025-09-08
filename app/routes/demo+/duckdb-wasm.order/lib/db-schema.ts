import type { Generated } from 'kysely'

// Helpers for column typing

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
    updated_at: Generated<Date>
    created_at: Generated<Date>
  }
  sync_state: {
    scope: string
    last_synced_at: Generated<Date> | null
    last_cursor: string | null
    updated_at: Generated<Date>
    created_at: Generated<Date>
  }
  sync_job: {
    run_id: string
    scope: string
    status: 'running' | 'success' | 'error'
    started_at: Date | null
    heartbeat_at: Generated<Date> | null
    finished_at: Generated<Date> | null
    from_synced_at: Generated<Date> | null
    from_cursor: string | null
    progress_synced_at: Generated<Date> | null
    progress_cursor: string | null
    error: string | null
    updated_at: Generated<Date> | null
    created_at: Generated<Date> | null
  }
}
