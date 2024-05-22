/*
  Warnings:

  - You are about to drop the column `value` on the `socials` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `socials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `socials` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "socials_value_key";

-- AlterTable
ALTER TABLE "socials" DROP COLUMN "value",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "socials_url_key" ON "socials"("url");
