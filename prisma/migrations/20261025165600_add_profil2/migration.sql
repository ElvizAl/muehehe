/*
  Warnings:

  - You are about to drop the `cats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cats" DROP CONSTRAINT "cats_userId_fkey";

-- DropTable
DROP TABLE "cats";

-- DropEnum
DROP TYPE "CatSex";

-- DropEnum
DROP TYPE "LivingEnvironment";

-- DropEnum
DROP TYPE "NeuterStatus";

-- DropEnum
DROP TYPE "VaccinationStatus";

-- CreateTable
CREATE TABLE "Cat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ageMonths" INTEGER,
    "breed" TEXT,
    "gender" TEXT NOT NULL,
    "vaccinated" BOOLEAN,
    "environment" TEXT,
    "healthHistory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cat_userId_key" ON "Cat"("userId");

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
