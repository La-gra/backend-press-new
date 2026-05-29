-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_articleId_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "articleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
