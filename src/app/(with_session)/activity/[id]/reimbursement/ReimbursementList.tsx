"use client";
import { Descriptions, List } from "antd";
import { Reimbursement, ReimbursementStatus } from "@prisma/client";
import { DescriptionsItemType } from "antd/es/descriptions";

type ReimbursementModified = Omit<Reimbursement, "amount"> & {
  handler: { username: string; id: number } | null;
  amount: string;
};

export default function ReimbursementList({
  activityId,
  data,
}: {
  activityId: number;
  data: ReimbursementModified[];
}) {
  return (
    <List
      dataSource={data}
      renderItem={SingleReimbursement}
      className="mx-[30px] mt-[20px]"
    />
  );
}

function SingleReimbursement(data: ReimbursementModified) {
  let items: DescriptionsItemType[] = [
    {
      label: "报销名称",
      children: data.title,
    },
    {
      label: "报销金额",
      children: data.amount.toString() + "￥",
    },
    {
      label: "状态",
      children: <Status status={data.status} />,
      span: 2,
    },
    {
      label: "情况说明",
      children: (
        <div
          className="prose-sm"
          dangerouslySetInnerHTML={{ __html: data.info }}
        />
      ),
      span: 3,
    },
  ];
  if (data.status !== "PENDING") {
    items[2].span = 1;
    items.splice(2, 0, {
      label: "审批人",
      children: data.handler!.username,
    });
    items.splice(items.length - 1, 0, {
      label: "备注",
      children: (
        <div
          className="prose-sm"
          dangerouslySetInnerHTML={{ __html: data.comment! }}
        />
      ),
      span: 2,
    });
  }
  return (
    <Descriptions items={items} column={3} bordered className="my-[10px]" />
  );
}

function Status({ status }: { status: ReimbursementStatus }) {
  const text = {
    PENDING: "审批中",
    REJECTED: "已驳回",
    APPROVED: "已批准",
  }[status];
  const color = {
    PENDING: "rgb(156, 163, 175)",
    REJECTED: "rgb(248, 113, 113)",
    APPROVED: "rgb(74, 222, 128)",
  }[status];
  return (
    <div className="flex items-center">
      <div
        className="size-[15px] rounded-full m-[5px]"
        style={{ backgroundColor: color }}
      />
      <span>{text}</span>
    </div>
  );
}
