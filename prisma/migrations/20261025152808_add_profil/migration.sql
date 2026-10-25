-- CreateEnum
CREATE TYPE "CatSex" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "NeuterStatus" AS ENUM ('NEUTERED', 'NOT_NEUTERED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "VaccinationStatus" AS ENUM ('COMPLETE', 'PARTIAL', 'NOT_VACCINATED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "LivingEnvironment" AS ENUM ('INDOOR', 'OUTDOOR', 'MIXED', 'UNKNOWN');

-- CreateTable
CREATE TABLE "cats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT,
    "ageYears" INTEGER,
    "ageMonths" INTEGER,
    "ageRecordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAgeEstimated" BOOLEAN NOT NULL DEFAULT false,
    "sex" "CatSex" NOT NULL DEFAULT 'UNKNOWN',
    "weightKg" DECIMAL(5,2),
    "neuterStatus" "NeuterStatus" NOT NULL DEFAULT 'UNKNOWN',
    "vaccinationStatus" "VaccinationStatus" NOT NULL DEFAULT 'UNKNOWN',
    "livingEnvironment" "LivingEnvironment" NOT NULL DEFAULT 'UNKNOWN',
    "healthHistory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cats_userId_idx" ON "cats"("userId");

-- AddForeignKey
ALTER TABLE "cats" ADD CONSTRAINT "cats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
