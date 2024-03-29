/*
  Warnings:

  - You are about to drop the `UserAccessOnOriginalTrack` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdByUserId` to the `OriginalTrack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAccessOnOriginalTrack" DROP CONSTRAINT "UserAccessOnOriginalTrack_originalTrackId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccessOnOriginalTrack" DROP CONSTRAINT "UserAccessOnOriginalTrack_userId_fkey";

-- AlterTable
ALTER TABLE "OriginalTrack" ADD COLUMN     "createdByUserId" UUID NOT NULL;

-- DropTable
DROP TABLE "UserAccessOnOriginalTrack";

-- DropEnum
DROP TYPE "UserOriginalTrackAccessRole";

-- AddForeignKey
ALTER TABLE "OriginalTrack" ADD CONSTRAINT "OriginalTrack_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
