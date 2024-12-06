/*
  Warnings:

  - A unique constraint covering the columns `[commentId]` on the table `CommentFile` will be added. If there are existing duplicate values, this will fail.
  - Made the column `commentId` on table `CommentFile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommentFile" ALTER COLUMN "commentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CommentFile_commentId_key" ON "CommentFile"("commentId");
