-- CreateTable
CREATE TABLE "CommentFile" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "resource_type" "ImageType" NOT NULL DEFAULT 'IMAGE',
    "secure_url" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "commentId" INTEGER,

    CONSTRAINT "CommentFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentFile" ADD CONSTRAINT "CommentFile_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
