-- Migration number: 0005
-- Remix 3 への移行でデモページを削除したため、デモ用のテーブルを消す
DROP TABLE IF EXISTS fts_index;
DROP TABLE IF EXISTS fts_contents;
DROP TABLE IF EXISTS uploaded_files;
DROP TABLE IF EXISTS sample_orders;
