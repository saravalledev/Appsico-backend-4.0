/*
  Warnings:

  - The values [pacient] on the enum `TypeUserEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeUserEnum_new" AS ENUM ('patient', 'professional');
ALTER TABLE "users" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "type" TYPE "TypeUserEnum_new" USING ("type"::text::"TypeUserEnum_new");
ALTER TYPE "TypeUserEnum" RENAME TO "TypeUserEnum_old";
ALTER TYPE "TypeUserEnum_new" RENAME TO "TypeUserEnum";
DROP TYPE "TypeUserEnum_old";
ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'patient';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'patient';
