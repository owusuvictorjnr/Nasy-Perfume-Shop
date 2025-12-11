-- Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN', 'STAFF');

-- Update role column to use the enum
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING role::text::"UserRole";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER'::"UserRole";
