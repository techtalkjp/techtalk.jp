-- Migration number: 0004    2026-09-14T00:00:00.000Z

CREATE TABLE IF NOT EXISTS inquiry_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message_excerpt TEXT NOT NULL,
  rule_score INTEGER NOT NULL,
  rule_tier TEXT NOT NULL,
  rule_reasons TEXT NOT NULL DEFAULT '[]',
  llm_verdict TEXT NOT NULL,
  llm_confidence INTEGER NOT NULL DEFAULT 0,
  llm_reason TEXT,
  llm_model TEXT,
  routed_as TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiry_evaluations_created_at
  ON inquiry_evaluations(created_at);
