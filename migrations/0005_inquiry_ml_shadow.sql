-- 並行評価専用。既存行はNULLのまま、本番振り分けは既存LLMで継続する。
ALTER TABLE inquiry_evaluations ADD COLUMN ml_verdict TEXT CHECK (ml_verdict IN ('sales', 'gray', 'normal'));
ALTER TABLE inquiry_evaluations ADD COLUMN ml_score REAL CHECK (ml_score >= 0 AND ml_score <= 1);
ALTER TABLE inquiry_evaluations ADD COLUMN ml_model TEXT;
ALTER TABLE inquiry_evaluations ADD COLUMN ml_error TEXT;
ALTER TABLE inquiry_evaluations ADD COLUMN llm_succeeded INTEGER CHECK (llm_succeeded IN (0, 1));
ALTER TABLE inquiry_evaluations ADD COLUMN human_verdict TEXT CHECK (human_verdict IN ('sales', 'gray', 'normal'));
ALTER TABLE inquiry_evaluations ADD COLUMN human_labeled_at TEXT;
