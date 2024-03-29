-- CreateEnum
CREATE TYPE "CoordinateType" AS ENUM ('BLOOD_AND_HOOF', 'HOOF', 'DOG');

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "weather" TEXT,
    "description" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordinate" (
    "id" SERIAL NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "long" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "CoordinateType" NOT NULL,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "Coordinate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coordinate" ADD CONSTRAINT "Coordinate_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
