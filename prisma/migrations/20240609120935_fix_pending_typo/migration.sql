/*
  Warnings:

  - The values [PENDDING] on the enum `ReimbursementStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReimbursementStatus_new" AS ENUM ('PENDING', 'REJECTED', 'APPROVED');
ALTER TABLE "Reimbursement"
    ALTER COLUMN "status" TYPE "ReimbursementStatus_new" USING ("status"::text::"ReimbursementStatus_new");
ALTER TYPE "ReimbursementStatus" RENAME TO "ReimbursementStatus_old";
ALTER TYPE "ReimbursementStatus_new" RENAME TO "ReimbursementStatus";
DROP TYPE "ReimbursementStatus_old";
COMMIT;
