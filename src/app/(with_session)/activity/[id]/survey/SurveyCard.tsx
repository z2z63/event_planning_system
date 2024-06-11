import { Survey } from "@prisma/client";
import Link from "next/link";
import dayjs from "dayjs";
import React from "react";

export function GenericSurveyCard(whereToGo: "fill-out" | "statistics") {
  type SurveyCardProp = Omit<Survey, "model" | "creatorId"> & {
    creator: {
      username: string;
      id: number;
    };
  };
  return function SurveyCard(survey: SurveyCardProp) {
    return (
      <Link
        href={`/activity/${survey.activityId}/survey/${survey.id}/${whereToGo}`}
        key={survey.id}
        className="flex flex-col justify-around bg-gray-200 rounded-[5px] px-[20px] py-[5px] w-[800px]
      mb-[15px] hover:bg-gray-300 cursor-pointer transition-[background-color] ease-in-out"
      >
        <span>{survey.title}</span>
        <div className="flex">
          <span className="text-gray-500 text-[12px]">
            {dayjs(survey.creatTime).format("YYYY年MM月DD日HH时")}
          </span>
          <span className="text-gray-500 text-[12px] ml-[40px]">
            由 {survey.creator.username} 创建
          </span>
        </div>
      </Link>
    );
  };
}
