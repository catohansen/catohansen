-- Create SystemConfig table if it doesn't exist
CREATE TABLE IF NOT EXISTS "system_config" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- Create unique index on key
CREATE UNIQUE INDEX IF NOT EXISTS "system_config_key_key" ON "system_config"("key");

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS "system_config_key_idx" ON "system_config"("key");



