-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "blob";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "event_planing_system";

-- CreateEnum
CREATE TYPE "event_planing_system"."ReimbursementStatus" AS ENUM ('PENDDING', 'REJECTED', 'APPROVED');

-- CreateTable
CREATE TABLE "event_planing_system"."User"
(
    "id"       SERIAL      NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "salt"     CHAR(64)    NOT NULL,
    "hash"     CHAR(32)    NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."Activity"
(
    "id"          SERIAL       NOT NULL,
    "name"        VARCHAR(128) NOT NULL,
    "startTime"   TIMESTAMP(3) NOT NULL,
    "endTime"     TIMESTAMP(3) NOT NULL,
    "budget"      MONEY        NOT NULL,
    "expenditure" MONEY        NOT NULL DEFAULT 0,
    "blobId"      INTEGER      NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."Resource"
(
    "id"   SERIAL       NOT NULL,
    "name" VARCHAR(128) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."Permission"
(
    "name"         VARCHAR(128) NOT NULL,
    "organizer"    BOOLEAN      NOT NULL,
    "participants" BOOLEAN      NOT NULL,
    "admin"        BOOLEAN      NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "event_planing_system"."Attachment"
(
    "id"              SERIAL       NOT NULL,
    "filename"        VARCHAR(128) NOT NULL,
    "visibility"      BIGINT       NOT NULL,
    "size"            INTEGER      NOT NULL,
    "reimbursementId" INTEGER,
    "blobId"          INTEGER      NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."ResourceGroup"
(
    "id"   SERIAL       NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "info" TEXT         NOT NULL,

    CONSTRAINT "ResourceGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."Reimbursement"
(
    "id"         SERIAL                                       NOT NULL,
    "amount"     MONEY                                        NOT NULL,
    "info"       TEXT                                         NOT NULL,
    "status"     "event_planing_system"."ReimbursementStatus" NOT NULL,
    "handleTime" TIMESTAMP(3)                                 NOT NULL,
    "commemt"    TEXT                                         NOT NULL,
    "handlerId"  INTEGER                                      NOT NULL,
    "userId"     INTEGER                                      NOT NULL,
    "activityId" INTEGER                                      NOT NULL,

    CONSTRAINT "Reimbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."UserGroup"
(
    "id"         SERIAL  NOT NULL,
    "name"       TEXT    NOT NULL,
    "info"       TEXT    NOT NULL,
    "activityId" INTEGER NOT NULL,
    "seq"        INTEGER NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."Notification"
(
    "id"         SERIAL  NOT NULL,
    "content"    TEXT    NOT NULL,
    "visibility" BIGINT  NOT NULL,
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."NotificationComfirm"
(
    "id"         SERIAL  NOT NULL,
    "activityId" INTEGER NOT NULL,
    "userId"     INTEGER NOT NULL,

    CONSTRAINT "NotificationComfirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."Agenda"
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
CREATE TABLE "blob"."Blob"
(
    "id"   SERIAL NOT NULL,
    "data" BYTEA  NOT NULL,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_planing_system"."_UserToUserGroup"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "event_planing_system"."_ActivityToResource"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "event_planing_system"."User" ("username");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserGroup_AB_unique" ON "event_planing_system"."_UserToUserGroup" ("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserGroup_B_index" ON "event_planing_system"."_UserToUserGroup" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToResource_AB_unique" ON "event_planing_system"."_ActivityToResource" ("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToResource_B_index" ON "event_planing_system"."_ActivityToResource" ("B");

-- AddForeignKey
ALTER TABLE "event_planing_system"."Activity"
    ADD CONSTRAINT "Activity_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "blob"."Blob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."Attachment"
    ADD CONSTRAINT "Attachment_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "blob"."Blob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."Attachment"
    ADD CONSTRAINT "Attachment_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "event_planing_system"."Reimbursement" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."Reimbursement"
    ADD CONSTRAINT "Reimbursement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "event_planing_system"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."Reimbursement"
    ADD CONSTRAINT "Reimbursement_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "event_planing_system"."Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."Reimbursement"
    ADD CONSTRAINT "Reimbursement_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "event_planing_system"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."UserGroup"
    ADD CONSTRAINT "UserGroup_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "event_planing_system"."Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."Notification"
    ADD CONSTRAINT "Notification_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "event_planing_system"."Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."NotificationComfirm"
    ADD CONSTRAINT "NotificationComfirm_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "event_planing_system"."Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."NotificationComfirm"
    ADD CONSTRAINT "NotificationComfirm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "event_planing_system"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."Agenda"
    ADD CONSTRAINT "Agenda_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "event_planing_system"."Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."_UserToUserGroup"
    ADD CONSTRAINT "_UserToUserGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "event_planing_system"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."_UserToUserGroup"
    ADD CONSTRAINT "_UserToUserGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "event_planing_system"."UserGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."_ActivityToResource"
    ADD CONSTRAINT "_ActivityToResource_A_fkey" FOREIGN KEY ("A") REFERENCES "event_planing_system"."Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_planing_system"."_ActivityToResource"
    ADD CONSTRAINT "_ActivityToResource_B_fkey" FOREIGN KEY ("B") REFERENCES "event_planing_system"."Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
