-- CreateTable
CREATE TABLE "contents" (
    "sourceId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "tags" (
    "tagId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "contents_sourceId_contentId_key" ON "contents"("sourceId", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_tagId_sourceId_contentId_key" ON "tags"("tagId", "sourceId", "contentId");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_sourceId_contentId_fkey" FOREIGN KEY ("sourceId", "contentId") REFERENCES "contents"("sourceId", "contentId") ON DELETE CASCADE ON UPDATE CASCADE;
