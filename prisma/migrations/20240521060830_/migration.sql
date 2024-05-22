/*
  Warnings:

  - Added the required column `city` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" INTEGER,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "uf" VARCHAR(2) NOT NULL,
ADD COLUMN     "zip_code" VARCHAR(8) NOT NULL;
