/*
  Warnings:

  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profiles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProfilesToSpecialties" DROP CONSTRAINT "_ProfilesToSpecialties_A_fkey";

-- DropIndex
DROP INDEX "profiles_id_key";

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "id",
ALTER COLUMN "user_id" SET DEFAULT '',
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_validated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "contacts" (
    "id" VARCHAR(26) NOT NULL DEFAULT '',
    "profile_id" VARCHAR(26) NOT NULL,
    "value" VARCHAR(13) NOT NULL,
    "validated_at" DATE,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socials" (
    "id" VARCHAR(26) NOT NULL DEFAULT '',
    "profile_id" VARCHAR(26) NOT NULL,
    "value" TEXT NOT NULL,
    "validated_at" DATE,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_id_key" ON "contacts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_value_key" ON "contacts"("value");

-- CreateIndex
CREATE UNIQUE INDEX "socials_id_key" ON "socials"("id");

-- CreateIndex
CREATE UNIQUE INDEX "socials_value_key" ON "socials"("value");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socials" ADD CONSTRAINT "socials_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfilesToSpecialties" ADD CONSTRAINT "_ProfilesToSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
