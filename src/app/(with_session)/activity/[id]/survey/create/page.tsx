"use client";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { Button } from "antd";
import { newSurvey } from "@/app/(with_session)/action";
import { useMemo } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const activityId = parseInt(params.id);

  const creator = useMemo(() => {
    const creatorOptions = {
      showLogicTab: true,
      isAutoSave: true,
    };
    const _creator = new SurveyCreator(creatorOptions);
    _creator.saveSurveyFunc = (
      saveNo: number,
      callback: (saveNo: number, accepted: boolean) => void,
    ) => {
      window.localStorage.setItem("survey-json", _creator.text);
      callback(saveNo, true);
    };
    _creator.text = window.localStorage.getItem("survey-json") || "";
    return _creator;
  }, []);

  async function submit() {
    await newSurvey(activityId, BigInt(-1), creator.text);
    window.localStorage.removeItem("survey-json");
    window.location.href = `/activity/${activityId}/survey/statistics-list`;
  }

  return (
    <div className="flex flex-col items-center h-full">
      <Button type="primary" onClick={submit}>
        提交问卷
      </Button>
      <div className="h-full w-full grow">
        <SurveyCreatorComponent creator={creator} />
      </div>
    </div>
  );
}
