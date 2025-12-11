-- Add shortDescription column
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "shortDescription" TEXT;
