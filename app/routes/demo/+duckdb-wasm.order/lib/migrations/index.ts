import m0001 from './0001_sample_orders'
import m0002 from './0002_sync_status'

export const migrations = [
  { name: '0001_sample_orders', ...m0001 },
  { name: '0002_sync_status', ...m0002 },
]
