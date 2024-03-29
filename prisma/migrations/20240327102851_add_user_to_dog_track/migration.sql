/*
  Warnings:

  - Added the required column `createdByUserId` to the `DogTrack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OriginalTrack" DROP CONSTRAINT "OriginalTrack_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "DogTrack" ADD COLUMN     "createdByUserId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "OriginalTrack" ADD CONSTRAINT "OriginalTrack_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogTrack" ADD CONSTRAINT "DogTrack_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
