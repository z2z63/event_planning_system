import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import Image from "next/image";
import { MyBreadCrumb } from "@/app/(with_session)/activity/[id]/MyBreadCrumb";
import { ItemType } from "antd/es/menu/interface";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const icon1 = (
    <Image
      src="/reimbursement.svg"
      alt="overview icon"
      width={18}
      height={18}
    />
  );
  const icon2 = (
    <Image src="/survey.svg" alt="overview icon" width={18} height={18} />
  );

  const activityId = Number(params.id);
  const items: ItemType[] = [
    {
      key: "1",
      label: (
        <Link href={`/activity/${activityId}/overview`} className="text-[18px]">
          活动总览
        </Link>
      ),
      icon: (
        <Image src="/overview.svg" alt="overview icon" width={18} height={18} />
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <Link href={`/activity/${activityId}/chat`} className="text-[18px]">
          在线聊天
        </Link>
      ),
      icon: (
        <Image src="/chat.svg" alt="overview icon" width={18} height={18} />
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <Link
          href={`/activity/${activityId}/file_share`}
          className="text-[18px]"
        >
          资料分享
        </Link>
      ),
      icon: (
        <Image
          src="/file_share.svg"
          alt="overview icon"
          width={18}
          height={18}
        />
      ),
    },
    {
      type: "divider",
    },
    {
      // key: "4",
      label: "费用报销",
      type: "group",
      children: [
        {
          icon: icon1,
          label: (
            <Link href={`/activity/${activityId}/reimbursement/create`}>
              申请经费报销
            </Link>
          ),
          key: "reimbursement create",
        },
        {
          icon: icon1,
          label: (
            <Link href={`/activity/${activityId}/reimbursement/`}>
              经费报销记录
            </Link>
          ),
          key: "reimbursement list",
        },
        {
          icon: icon1,
          label: (
            <Link href={`/activity/${activityId}/reimbursement/handle`}>
              审批经费报销
            </Link>
          ),
          key: "reimbursement handle",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "5",
      label: (
        <Link href={`/activity/${activityId}/survey`} className="text-[18px]">
          问卷反馈
        </Link>
      ),
      type: "group",
      children: [
        {
          label: (
            <Link
              href={`/activity/${activityId}/survey/create`}
              className="text-[18px]"
            >
              创建问卷
            </Link>
          ),
          icon: icon2,
          key: "create survey",
        },
        {
          label: (
            <Link
              href={`/activity/${activityId}/survey/fill-out-list`}
              className="text-[18px]"
            >
              待填写问卷
            </Link>
          ),
          icon: icon2,
          key: "survey list",
        },
        {
          label: (
            <Link
              href={`/activity/${activityId}/survey/statistics-list`}
              className="text-[18px]"
            >
              问卷统计总览
            </Link>
          ),
          icon: icon2,
          key: "survey dashboard",
        },
      ],
    },
  ];
  return (
    <div className="flex h-full">
      <Menu className="w-[200px] shrink-0" items={items} />
      <div className="flex flex-col h-full grow">
        <MyBreadCrumb />
        {children}
      </div>
    </div>
  );
}
