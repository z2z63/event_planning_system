"use client";
import { Button } from "antd";
import React from "react";
import useAgendaInput from "@/app/(with_session)/activity/create/AgendaInput";
import useUserGroupsInput from "@/app/(with_session)/activity/create/UserGroupsInput";
import useRichTextEditor from "@/app/(with_session)/activity/create/RichTextEditor";
import {
  OverviewFormDataType,
  useOverviewForm,
} from "@/app/(with_session)/activity/create/OverviewForm";
import { newActivity } from "@/app/(with_session)/action";

export default function Page() {
  async function onSubmit(overviewFormData: OverviewFormDataType) {
    const activityId = await newActivity(
      overviewFormData,
      getEditorData(),
      getUserGroupData(),
      getAgendaData(),
    );
    window.location.href = `/activity/${activityId}`;
  }

  const { AgendaInput, getAgendaData } = useAgendaInput();
  const { UserGroupsInput, getUserGroupData } = useUserGroupsInput();
  const { RichTextEditor, getEditorData } = useRichTextEditor(
    "<h4>请输入活动内容，支持富文本，支持markdown</h4>",
  );
  const { OverviewForm, triggerFormSubmit } = useOverviewForm(onSubmit);
  return (
    <div className="flex flex-col justify-around items-center">
      <div className="flex justify-around w-screen">
        <div className="flex flex-col ml-[200px]">
          {OverviewForm}
          <div>{UserGroupsInput}</div>
        </div>
        <div className="flex flex-col mr-[200px]">
          <div className="my-[20px] w-[600px]">
            <span className="text-[18px] mb-[20px]">活动内容</span>
            {RichTextEditor}
          </div>
          {AgendaInput}
        </div>
      </div>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          triggerFormSubmit();
        }}
        className="w-[80px] my-[40px]"
      >
        提交
      </Button>
    </div>
  );
}
