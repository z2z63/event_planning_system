/*
  Warnings:

  - A unique constraint covering the columns `[blobId]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Attachment"
    ADD COLUMN "activityId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_blobId_key" ON "Attachment" ("blobId");

-- AddForeignKey
ALTER TABLE "Attachment"
    ADD CONSTRAINT "Attachment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
