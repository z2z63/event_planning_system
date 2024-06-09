/*
  Warnings:

  - You are about to drop the column `reimbursementId` on the `Attachment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment"
    DROP CONSTRAINT "Attachment_reimbursementId_fkey";

-- AlterTable
ALTER TABLE "Attachment"
    DROP COLUMN "reimbursementId";

-- AlterTable
ALTER TABLE "Blob"
    ADD COLUMN "reimbursementId" INTEGER;

-- AddForeignKey
ALTER TABLE "Blob"
    ADD CONSTRAINT "Blob_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "Reimbursement" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
