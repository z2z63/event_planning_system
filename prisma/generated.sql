-- CreateEnum
CREATE TYPE "ReimbursementStatus" AS ENUM ('PENDDING', 'REJECTED', 'APPROVED');

-- CreateTable
CREATE TABLE "Activity"
(
    "id"          SERIAL       NOT NULL,
    "name"        VARCHAR(128) NOT NULL,
    "startTime"   TIMESTAMP(3) NOT NULL,
    "endTime"     TIMESTAMP(3) NOT NULL,
    "budget"      MONEY        NOT NULL,
    "expenditure" MONEY        NOT NULL DEFAULT 0,
    "blobId"      INTEGER      NOT NULL,
    "info" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda"
(
    "id"         SERIAL       NOT NULL,
    "name"       VARCHAR(128) NOT NULL,
    "startTime"  TIMESTAMP(3) NOT NULL,
    "endTime"    TIMESTAMP(3) NOT NULL,
    "info"       TEXT         NOT NULL,
    "activityId" INTEGER      NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment"
(
    "id"         SERIAL       NOT NULL,
    "filename"   VARCHAR(128) NOT NULL,
    "visibility" BIGINT       NOT NULL,
    "size"       INTEGER      NOT NULL,
    "blobId"     INTEGER      NOT NULL,
    "reimbursementId" INTEGER,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blob"
(
    "id"   SERIAL NOT NULL,
    "data" BYTEA  NOT NULL,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification"
(
    "id"         SERIAL NOT NULL,
    "content"    TEXT   NOT NULL,
    "visibility" BIGINT NOT NULL,
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationComfirm"
(
    "id"     SERIAL  NOT NULL,
    "activityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "NotificationComfirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission"
(
    "name"         VARCHAR(128) NOT NULL,
    "organizer"    BOOLEAN      NOT NULL,
    "participants" BOOLEAN      NOT NULL,
    "admin"        BOOLEAN      NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Reimbursement"
(
    "id"         SERIAL                NOT NULL,
    "amount"     MONEY                 NOT NULL,
    "info"       TEXT                  NOT NULL,
    "status"     "ReimbursementStatus" NOT NULL,
    "userId"     INTEGER               NOT NULL,
    "activityId" INTEGER               NOT NULL,
    "commemt"    TEXT                  NOT NULL,
    "handleTime" TIMESTAMP(3)          NOT NULL,
    "handlerId"  INTEGER               NOT NULL,

    CONSTRAINT "Reimbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource"
(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceGroup"
(
    "id"   SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "info" TEXT   NOT NULL,

    CONSTRAINT "ResourceGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User"
(
    "id"   SERIAL   NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "salt" CHAR(64) NOT NULL,
    "hash" CHAR(32) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup"
(
    "id"   SERIAL  NOT NULL,
    "name" TEXT    NOT NULL,
    "info" TEXT    NOT NULL,
    "activityId" INTEGER NOT NULL,
    "seq"  INTEGER NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityToResource"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToUserGroup"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToResource_AB_unique" ON "_ActivityToResource" ("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_ActivityToResource_B_index" ON "_ActivityToResource" ("B" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserGroup_AB_unique" ON "_UserToUserGroup" ("A" ASC, "B" ASC);

-- CreateIndex
CREATE INDEX "_UserToUserGroup_B_index" ON "_UserToUserGroup" ("B" ASC);

-- AddForeignKey
ALTER TABLE "Activity"
    ADD CONSTRAINT "Activity_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "Blob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda"
    ADD CONSTRAINT "Agenda_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment"
    ADD CONSTRAINT "Attachment_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "Blob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment"
    ADD CONSTRAINT "Attachment_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "Reimbursement" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationComfirm"
    ADD CONSTRAINT "NotificationComfirm_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationComfirm"
    ADD CONSTRAINT "NotificationComfirm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reimbursement"
    ADD CONSTRAINT "Reimbursement_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reimbursement"
    ADD CONSTRAINT "Reimbursement_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reimbursement"
    ADD CONSTRAINT "Reimbursement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup"
    ADD CONSTRAINT "UserGroup_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToResource"
    ADD CONSTRAINT "_ActivityToResource_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToResource"
    ADD CONSTRAINT "_ActivityToResource_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserGroup"
    ADD CONSTRAINT "_UserToUserGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserGroup"
    ADD CONSTRAINT "_UserToUserGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "UserGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

