/*
  Warnings:

  - You are about to drop the column `commemt` on the `Reimbursement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reimbursement"
    DROP COLUMN "commemt",
    ADD COLUMN "comment" TEXT;
