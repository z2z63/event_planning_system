-- AlterTable
ALTER TABLE "Attachment"
    ADD COLUMN "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
