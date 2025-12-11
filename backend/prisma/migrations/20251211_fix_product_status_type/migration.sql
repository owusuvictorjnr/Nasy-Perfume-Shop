-- Fix product status column to use TEXT instead of enum
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE TEXT USING status::text;
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_status_check";
