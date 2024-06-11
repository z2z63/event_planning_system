-- CreateTable
CREATE TABLE "Survey"
(
    "id"         SERIAL       NOT NULL,
    "titile"     VARCHAR(256) NOT NULL,
    "model"      TEXT         NOT NULL,
    "creatorId"  INTEGER      NOT NULL,
    "activityId" INTEGER      NOT NULL,
    "creatTime"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Survey"
    ADD CONSTRAINT "Survey_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey"
    ADD CONSTRAINT "Survey_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
