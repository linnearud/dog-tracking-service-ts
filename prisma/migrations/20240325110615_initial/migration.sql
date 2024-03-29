-- CreateEnum
CREATE TYPE "BucketHost" AS ENUM ('SUPABASE');

-- CreateEnum
CREATE TYPE "BucketAssetType" AS ENUM ('IMAGE');

-- CreateEnum
CREATE TYPE "UserDogAccessRole" AS ENUM ('OWNER', 'EDITOR');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketAsset" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "BucketAssetType" NOT NULL DEFAULT 'IMAGE',
    "host" "BucketHost" NOT NULL DEFAULT 'SUPABASE',
    "bucket" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255) NOT NULL,

    CONSTRAINT "BucketAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketAssetOnDog" (
    "bucketAssetId" INTEGER NOT NULL,
    "dogId" INTEGER NOT NULL,

    CONSTRAINT "BucketAssetOnDog_pkey" PRIMARY KEY ("bucketAssetId","dogId")
);

-- CreateTable
CREATE TABLE "Dog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "breed" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Dog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccessOnDog" (
    "accessRole" "UserDogAccessRole" NOT NULL,
    "userId" UUID NOT NULL,
    "dogId" INTEGER NOT NULL,

    CONSTRAINT "UserAccessOnDog_pkey" PRIMARY KEY ("userId","dogId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "BucketAssetOnDog" ADD CONSTRAINT "BucketAssetOnDog_bucketAssetId_fkey" FOREIGN KEY ("bucketAssetId") REFERENCES "BucketAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketAssetOnDog" ADD CONSTRAINT "BucketAssetOnDog_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessOnDog" ADD CONSTRAINT "UserAccessOnDog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessOnDog" ADD CONSTRAINT "UserAccessOnDog_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
