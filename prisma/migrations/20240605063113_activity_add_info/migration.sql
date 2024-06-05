/*
  Warnings:

  - Added the required column `info` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity"
    ADD COLUMN "info" TEXT NOT NULL;
