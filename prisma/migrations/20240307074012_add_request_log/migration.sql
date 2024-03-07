-- CreateTable
CREATE TABLE "request_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "headers" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "referer" TEXT,
    "referer_policy" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
