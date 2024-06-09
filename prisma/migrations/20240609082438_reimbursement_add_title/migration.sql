/*
  Warnings:

  - Added the required column `title` to the `Reimbursement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reimbursement"
    ADD COLUMN "title" VARCHAR(128) NOT NULL;
