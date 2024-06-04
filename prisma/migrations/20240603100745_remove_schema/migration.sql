/*
  Warnings:

  - Added the required column `blobId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity"
    ADD COLUMN "blobId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Blob"
(
    "id"   SERIAL NOT NULL,
    "data" BYTEA  NOT NULL,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity"
    ADD CONSTRAINT "Activity_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "Blob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment"
    ADD CONSTRAINT "Attachment_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "Blob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
