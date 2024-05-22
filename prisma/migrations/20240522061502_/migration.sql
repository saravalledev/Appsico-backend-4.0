-- AlterTable
ALTER TABLE "address" ADD COLUMN     "countryCode" VARCHAR(2),
ADD COLUMN     "stateCode" VARCHAR(2),
ALTER COLUMN "state" SET DATA TYPE TEXT,
ALTER COLUMN "country" SET DATA TYPE TEXT;
