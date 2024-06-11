/*
  Warnings:

  - Added the required column `submitTime` to the `Reimbursement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reimbursement"
    ADD COLUMN "submitTime" TIMESTAMP(3) NOT NULL;
