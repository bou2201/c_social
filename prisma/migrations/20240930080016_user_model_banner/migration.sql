/*
  Warnings:

  - A unique constraint covering the columns `[banner_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banner_id" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "image_url" DROP NOT NULL,
ALTER COLUMN "banner_url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_banner_id_key" ON "User"("banner_id");
