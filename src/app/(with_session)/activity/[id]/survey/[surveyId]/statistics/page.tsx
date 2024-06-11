import { getSurveyModel, getSurveyResults } from "@/app/(with_session)/action";
import DashBoard from "@/app/(with_session)/activity/[id]/survey/[surveyId]/statistics/DashBoard";

export default async function Page({
  params,
}: {
  params: { id: string; surveyId: string };
}) {
  console.log(params);
  const activityId = parseInt(params.id);
  const surveyId = parseInt(params.surveyId);
  const surveyModel = await getSurveyModel(surveyId);
  const surveyFillOutList = await getSurveyResults(surveyId);
  const surveyResults = surveyFillOutList.map((fillOut) =>
    JSON.parse(fillOut.fillOut),
  );
  return (
    <DashBoard surveyJson={surveyModel.model} surveyResults={surveyResults} />
  );
}
