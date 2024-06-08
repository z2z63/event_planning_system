"use client";

import { Descriptions } from "antd";
import { DescriptionsItemType } from "antd/es/descriptions";
import dayjs from "dayjs";
import { useContext } from "react";
import { SessionContext } from "@/app/(with_session)/SessionProvider";
import { ActivityData } from "@/app/(with_session)/activity/[id]/overview/page";

export function BasicInfo({
  data,
  className,
}: {
  data: ActivityData;
  className?: string;
}) {
  const session = useContext(SessionContext);
  let myGroup;
  for (const group of data.ParticipantGroup) {
    if (group.participants.some((e) => e.id === session.id)) {
      myGroup = {
        name: group.name,
        info: group.info,
      };
    }
  }
  if (myGroup === undefined) {
    throw new Error("No group found");
  }
  const now = Date.now();
  let status: "planning" | "progressing" | "ended";
  if (now <= data.startTime.getTime()) {
    status = "planning";
  } else if (now <= data.endTime.getTime()) {
    status = "progressing";
  } else {
    status = "ended";
  }
  const statusTable = {
    planning: "计划中",
    progressing: "进行中",
    ended: "已结束",
  };
  const color = {
    planning: "#e6f4ff",
    progressing: "#1677ff",
    ended: "rgba(0, 0, 0, 0.1)",
  }[status];
  const items: DescriptionsItemType[] = [
    { label: "名称", children: data.name, key: "name" },
    {
      label: "开始时间",
      children: dayjs(data.startTime).format("YYYY[年]M[月]D[日]"),
      key: "startTime",
    },
    {
      label: "结束时间",
      children: dayjs(data.endTime).format("YYYY[年]M[月]D[日]"),
      key: "endTime",
    },
    { label: "预算", children: data.budget + " ￥", key: "budget" },
    {
      label: "开销",
      children: data.expenditure + " ￥",
      key: "endTime",
    },
    {
      label: "我所属的组",
      children: (
        <div className="flex flex-col justify-around">
          <span className="my-[10px] text-[18px]">{myGroup.name}</span>
          <span>{myGroup.info}</span>
        </div>
      ),
      key: "userGroup",
    },
    {
      label: "状态",
      children: (
        <div className="flex items-center w-[100px]">
          <div
            className="h-[20px] w-[20px] rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="ml-[10px]">{statusTable[status]}</span>
        </div>
      ),
      key: "status",
    },
    {
      label: "参与人数",
      children:
        data.ParticipantGroup.reduce(
          (acc, cur) => acc + cur.participants.length,
          0,
        ).toString() + " 人",
      key: "participantCount",
      span: 2,
    },
    {
      label: "内容",
      children: (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: data.info }}
        />
      ),
      key: "info",
    },
  ];
  return (
    <div className={className}>
      <div className="flex flex-col">
        <span className="text-[24px] mx-[10px]">基本信息</span>
        <Descriptions items={items} bordered className="mt-[20px]" />
      </div>
    </div>
  );
}
