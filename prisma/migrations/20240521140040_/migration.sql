/*
  Warnings:

  - Added the required column `type` to the `socials` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeSocialEnum" AS ENUM ('instagram', 'x', 'facebook');

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "whatsapp" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "socials" ADD COLUMN     "type" "TypeSocialEnum" NOT NULL;
