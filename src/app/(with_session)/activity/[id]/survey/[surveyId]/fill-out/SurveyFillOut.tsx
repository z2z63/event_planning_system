"use client";

import { Survey as SurveyType } from "@prisma/client";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import "survey-core/defaultV2.min.css";
import { useCallback, useContext } from "react";
import { SessionContext } from "@/app/(with_session)/SessionProvider";
import { completeSurvey } from "@/app/(with_session)/action";

export default function SurveyFillOut({ survey }: { survey: SurveyType }) {
  const { id: userId, username: _ } = useContext(SessionContext);
  const surveyModel = new Model(survey.model);
  const onComplete = useCallback(
    async (surveyModel_: Model) => {
      surveyModel_.setValue("userId", userId);
      await completeSurvey(survey.id, JSON.stringify(surveyModel_.data));
    },
    [survey.id, userId],
  );
  surveyModel.onComplete.add(onComplete);
  return <Survey model={surveyModel} />;
}
