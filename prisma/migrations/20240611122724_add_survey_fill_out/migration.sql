-- AlterTable
ALTER TABLE "Survey"
    ADD COLUMN "visibility" BIGINT NOT NULL DEFAULT -1;

-- CreateTable
CREATE TABLE "SurveyFillOut"
(
    "id"       SERIAL       NOT NULL,
    "surveyId" INTEGER      NOT NULL,
    "userId"   INTEGER      NOT NULL,
    "fillOut"  TEXT         NOT NULL,
    "fillTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyFillOut_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyFillOut"
    ADD CONSTRAINT "SurveyFillOut_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyFillOut"
    ADD CONSTRAINT "SurveyFillOut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
