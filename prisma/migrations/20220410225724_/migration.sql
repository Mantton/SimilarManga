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
    "sourceId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "adultContent" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "ContentTag" (
    "tagId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "contents_sourceId_contentId_key" ON "contents"("sourceId", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_sourceId_tagId_key" ON "tags"("sourceId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTag_tagId_sourceId_contentId_key" ON "ContentTag"("tagId", "sourceId", "contentId");

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_sourceId_contentId_fkey" FOREIGN KEY ("sourceId", "contentId") REFERENCES "contents"("sourceId", "contentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_sourceId_tagId_fkey" FOREIGN KEY ("sourceId", "tagId") REFERENCES "tags"("sourceId", "tagId") ON DELETE RESTRICT ON UPDATE CASCADE;
