/*
  Warnings:

  - You are about to drop the column `approveTime` on the `Reimbursement` table. All the data in the column will be lost.
  - You are about to drop the column `approverId` on the `Reimbursement` table. All the data in the column will be lost.
  - Added the required column `commemt` to the `Reimbursement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handleTime` to the `Reimbursement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handlerId` to the `Reimbursement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reimbursement"
    DROP CONSTRAINT "Reimbursement_approverId_fkey";

-- AlterTable
ALTER TABLE "Reimbursement"
    DROP COLUMN "approveTime",
    DROP COLUMN "approverId",
    ADD COLUMN "commemt"    TEXT         NOT NULL,
    ADD COLUMN "handleTime" TIMESTAMP(3) NOT NULL,
    ADD COLUMN "handlerId"  INTEGER      NOT NULL;

-- AddForeignKey
ALTER TABLE "Reimbursement"
    ADD CONSTRAINT "Reimbursement_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
