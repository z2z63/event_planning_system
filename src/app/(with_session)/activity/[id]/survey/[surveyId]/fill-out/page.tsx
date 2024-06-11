import { getSurveyModel } from "@/app/(with_session)/action";
import SurveyFillOut from "@/app/(with_session)/activity/[id]/survey/[surveyId]/fill-out/SurveyFillOut";

export default async function Page({
  params,
}: {
  params: { id: string; surveyId: string };
}) {
  const activityId = parseInt(params.id);
  const surveyId = parseInt(params.surveyId);
  const survey = await getSurveyModel(surveyId);
  return <SurveyFillOut survey={survey} />;
}
