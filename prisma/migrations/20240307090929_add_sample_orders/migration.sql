-- CreateTable
CREATE TABLE "sample_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fly_region" TEXT NOT NULL,
    "fly_app_name" TEXT NOT NULL,
    "fly_machine_id" TEXT NOT NULL,
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
