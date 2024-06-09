-- DropForeignKey
ALTER TABLE "Reimbursement"
    DROP CONSTRAINT "Reimbursement_handlerId_fkey";

-- AlterTable
ALTER TABLE "Reimbursement"
    ALTER COLUMN "commemt" DROP NOT NULL,
    ALTER COLUMN "handleTime" DROP NOT NULL,
    ALTER COLUMN "handlerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reimbursement"
    ADD CONSTRAINT "Reimbursement_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
