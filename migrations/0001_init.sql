-- Migration number: 0001 	 2025-04-24T06:41:18.020Z

-- sample orders

CREATE TABLE IF NOT EXISTS sample_orders (
  id TEXT PRIMARY KEY,
  region TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  note TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

