-- CreateTable
CREATE TABLE "approach" (
    "id" VARCHAR(26) NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApproachToProfiles" (
    "A" VARCHAR(26) NOT NULL,
    "B" VARCHAR(26) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "approach_id_key" ON "approach"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ApproachToProfiles_AB_unique" ON "_ApproachToProfiles"("A", "B");

-- CreateIndex
CREATE INDEX "_ApproachToProfiles_B_index" ON "_ApproachToProfiles"("B");

-- AddForeignKey
ALTER TABLE "_ApproachToProfiles" ADD CONSTRAINT "_ApproachToProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "approach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApproachToProfiles" ADD CONSTRAINT "_ApproachToProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
