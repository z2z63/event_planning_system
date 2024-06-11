/*
  Warnings:

  - You are about to drop the column `filename` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `filename` to the `Blob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment"
    DROP COLUMN "filename",
    DROP COLUMN "size";

-- AlterTable
ALTER TABLE "Blob"
    ADD COLUMN "filename" VARCHAR(256) NOT NULL;
