/*
  Warnings:

  - You are about to drop the column `service` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "service",
ADD COLUMN     "services" "TypeServicesEnum"[];
