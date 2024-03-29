/*
  Warnings:

  - The primary key for the `UserAccessOnDog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "DogTrack" DROP CONSTRAINT "DogTrack_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "OriginalTrack" DROP CONSTRAINT "OriginalTrack_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccessOnDog" DROP CONSTRAINT "UserAccessOnDog_userId_fkey";

-- AlterTable
ALTER TABLE "DogTrack" ALTER COLUMN "createdByUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OriginalTrack" ALTER COLUMN "createdByUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserAccessOnDog" DROP CONSTRAINT "UserAccessOnDog_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserAccessOnDog_pkey" PRIMARY KEY ("userId", "dogId");

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserAccessOnDog" ADD CONSTRAINT "UserAccessOnDog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OriginalTrack" ADD CONSTRAINT "OriginalTrack_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogTrack" ADD CONSTRAINT "DogTrack_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
