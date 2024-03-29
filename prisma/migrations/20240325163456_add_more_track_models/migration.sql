-- CreateEnum
CREATE TYPE "UserOriginalTrackAccessRole" AS ENUM ('OWNER', 'EDITOR');

-- CreateTable
CREATE TABLE "OriginalTrack" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "OriginalTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogTrack" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "originalTrackId" INTEGER NOT NULL,
    "dogId" INTEGER NOT NULL,

    CONSTRAINT "DogTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccessOnOriginalTrack" (
    "accessRole" "UserOriginalTrackAccessRole" NOT NULL,
    "userId" UUID NOT NULL,
    "originalTrackId" INTEGER NOT NULL,

    CONSTRAINT "UserAccessOnOriginalTrack_pkey" PRIMARY KEY ("userId","originalTrackId")
);

-- AddForeignKey
ALTER TABLE "OriginalTrack" ADD CONSTRAINT "OriginalTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogTrack" ADD CONSTRAINT "DogTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogTrack" ADD CONSTRAINT "DogTrack_originalTrackId_fkey" FOREIGN KEY ("originalTrackId") REFERENCES "OriginalTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogTrack" ADD CONSTRAINT "DogTrack_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessOnOriginalTrack" ADD CONSTRAINT "UserAccessOnOriginalTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessOnOriginalTrack" ADD CONSTRAINT "UserAccessOnOriginalTrack_originalTrackId_fkey" FOREIGN KEY ("originalTrackId") REFERENCES "OriginalTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
