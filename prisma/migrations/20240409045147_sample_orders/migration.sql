-- CreateTable
CREATE TABLE IF NOT EXISTS "sample_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "created_at" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "sample_orders_created_at_idx" ON "sample_orders"("created_at");
