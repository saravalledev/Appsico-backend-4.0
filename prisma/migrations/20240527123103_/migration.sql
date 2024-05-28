/*
  Warnings:

  - You are about to drop the column `countryCode` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `stateCode` on the `address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "address" DROP COLUMN "countryCode",
DROP COLUMN "stateCode",
ADD COLUMN     "country_code" VARCHAR(2) NOT NULL DEFAULT '',
ADD COLUMN     "display_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "state_code" VARCHAR(2) NOT NULL DEFAULT '';
