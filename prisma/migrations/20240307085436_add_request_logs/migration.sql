-- CreateTable
CREATE TABLE "request_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fly_region" TEXT NOT NULL,
    "fly_app_name" TEXT NOT NULL,
    "fly_machine_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);
