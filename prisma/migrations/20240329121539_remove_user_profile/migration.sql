/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DogTrack" DROP CONSTRAINT "DogTrack_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "OriginalTrack" DROP CONSTRAINT "OriginalTrack_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccessOnDog" DROP CONSTRAINT "UserAccessOnDog_userId_fkey";

-- DropTable
DROP TABLE "UserProfile";
