import { getUnFilledSurveyList } from "@/app/(with_session)/action";
import React from "react";
import { GenericSurveyCard } from "@/app/(with_session)/activity/[id]/survey/SurveyCard";

export default async function Page({ params }: { params: { id: string } }) {
  const activityId = parseInt(params.id);
  const surveyList = await getUnFilledSurveyList(activityId);
  return (
    <div className="flex flex-col mx-[50px] my-[30px]">
      {surveyList.map(GenericSurveyCard("fill-out"))}
    </div>
  );
}
