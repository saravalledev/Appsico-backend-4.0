/*
  Warnings:

  - You are about to drop the column `uf` on the `address` table. All the data in the column will be lost.
  - You are about to alter the column `state` on the `address` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - Added the required column `country` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" DROP COLUMN "uf",
ADD COLUMN     "country" VARCHAR(2) NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "state" SET DATA TYPE VARCHAR(2);
