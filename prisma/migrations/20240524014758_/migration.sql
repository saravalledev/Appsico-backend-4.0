/*
  Warnings:

  - Made the column `countryCode` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stateCode` on table `address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "address" ALTER COLUMN "countryCode" SET NOT NULL,
ALTER COLUMN "stateCode" SET NOT NULL;
