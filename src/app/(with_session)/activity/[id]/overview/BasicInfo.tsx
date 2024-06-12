"use client";

import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
} from "antd";
import { DescriptionsItemType } from "antd/es/descriptions";
import dayjs, { Dayjs } from "dayjs";
import { useContext, useState } from "react";
import { SessionContext } from "@/app/(with_session)/SessionProvider";
import { ActivityData } from "@/app/(with_session)/activity/[id]/overview/page";
import Decimal from "decimal.js";
import useRichTextEditor from "@/app/(with_session)/activity/create/RichTextEditor";
import { updateActivityBasicInfo } from "@/app/(with_session)/action";

export function BasicInfo({
  data,
  className,
  canIOperate,
}: {
  data: ActivityData;
  className?: string;
  canIOperate: boolean;
}) {
  const session = useContext(SessionContext);
  const { RichTextEditor, getEditorData } = useRichTextEditor(data.info);
  const [editable, setEditable] = useState(false);
  const [form] = Form.useForm();
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
    {
      label: "名称",
      children: editable ? (
        <Form.Item name="name" initialValue={data.name}>
          <Input />
        </Form.Item>
      ) : (
        data.name
      ),
      key: "name",
    },
    {
      label: "时间范围",
      children: editable ? (
        <Form.Item
          name="dateTimeRange"
          initialValue={[dayjs(data.startTime), dayjs(data.endTime)]}
        >
          <DatePicker.RangePicker showTime className="max-w-[350px]" />
        </Form.Item>
      ) : (
        dayjs(data.startTime).format("YYYY年M月D日H时m分") +
        " - " +
        dayjs(data.endTime).format("YYYY年M月D日H时m分")
      ),
      key: "startTime",
      span: 2,
    },
    {
      label: "预算",
      children: editable ? (
        <Form.Item name="budget" initialValue={data.budget}>
          <InputNumber prefix="￥" />
        </Form.Item>
      ) : (
        data.budget + " ￥"
      ),
      key: "budget",
    },
    {
      label: "开销",
      children: data.expenditure + " ￥",
      key: "endTime",
    },
    {
      label: "经济状况",
      children:
        (new Decimal(data.budget) > new Decimal(data.expenditure)
          ? "剩余"
          : "超支") +
        " " +
        new Decimal(data.budget).minus(data.expenditure).abs().toString() +
        " ￥",
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
            className="size-[10px] rounded-full"
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
    },
    {
      label: "内容",
      children: editable ? (
        RichTextEditor
      ) : (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: data.info }}
        />
      ),
      key: "info",
    },
  ];

  function onSwitch() {
    if (editable) {
      form.submit();
    }
    setEditable(!editable);
  }

  type OverViewFormInputType = {
    budget: string;
    dateTimeRange: [Dayjs, Dayjs];
    name: string;
  };

  async function onFinish(formData: OverViewFormInputType) {
    await updateActivityBasicInfo(
      {
        name: formData.name,
        startTime: formData.dateTimeRange[0].toDate(),
        endTime: formData.dateTimeRange[1].toDate(),
        budget: formData.budget,
        info: getEditorData(),
      },
      data.id,
    );
  }

  return (
    <div className={className}>
      <Form className="flex flex-col" form={form} onFinish={onFinish}>
        <div className="flex justify-between">
          <span className="text-[24px] mx-[10px]">基本信息</span>
          {canIOperate ? (
            <Button onClick={onSwitch} type={editable ? "primary" : "default"}>
              {editable ? "保存" : "编辑"}
            </Button>
          ) : null}
        </div>
        <Descriptions items={items} bordered className="mt-[20px]" />
      </Form>
    </div>
  );
}
