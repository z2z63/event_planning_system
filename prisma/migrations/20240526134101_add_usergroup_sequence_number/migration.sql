/*
  Warnings:

  - Added the required column `seq` to the `UserGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGroup" ADD COLUMN     "seq" INTEGER NOT NULL;
