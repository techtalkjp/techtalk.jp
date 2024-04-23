/*
  Warnings:

  - You are about to alter the column `created_at` on the `sample_orders` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sample_orders" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT (uuid4()),
    "region" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_sample_orders" ("address", "city", "country", "created_at", "email", "id", "name", "note", "phone", "prefecture", "region", "zip") SELECT "address", "city", "country", "created_at", "email", uuid4(), "name", "note", "phone", "prefecture", "region", "zip" FROM "sample_orders";
DROP TABLE "sample_orders";
ALTER TABLE "new_sample_orders" RENAME TO "sample_orders";
CREATE INDEX "sample_orders_created_at_idx" ON "sample_orders"("created_at");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
