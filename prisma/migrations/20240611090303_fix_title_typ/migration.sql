/*
  Warnings:

  - You are about to drop the column `titile` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `title` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey"
    DROP COLUMN "titile",
    ADD COLUMN "title" VARCHAR(256) NOT NULL;
