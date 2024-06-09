import React from "react";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import Image from "next/image";
import { MyBreadCrumb } from "@/app/(with_session)/activity/[id]/crumb";

const items: Required<MenuProps>["items"][number][] = [
  {
    key: "1",
    label: (
      <Link href="overview" className="text-[18px]">
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
      <Link href="chat" className="text-[18px]">
        在线聊天
      </Link>
    ),
    icon: <Image src="/chat.svg" alt="overview icon" width={18} height={18} />,
  },
  {
    type: "divider",
  },
  {
    key: "3",
    label: (
      <Link href="file_share" className="text-[18px]">
        资料分享
      </Link>
    ),
    icon: (
      <Image src="/file_share.svg" alt="overview icon" width={18} height={18} />
    ),
  },
  {
    type: "divider",
  },
  {
    key: "4",
    label: (
      <Link href="reimbursement" className="text-[18px]">
        费用报销
      </Link>
    ),
    icon: (
      <Image
        src="/reimbursement.svg"
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
    key: "5",
    label: (
      <Link href="survey" className="text-[18px]">
        问卷反馈
      </Link>
    ),
    icon: (
      <Image src="/survey.svg" alt="overview icon" width={18} height={18} />
    ),
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <Menu className="w-[200px] shrink-0" items={items} />
      <div className="flex flex-col h-full">
        <MyBreadCrumb />
        {children}
      </div>
    </div>
  );
}
