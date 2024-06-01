"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "antd";
import Link from "next/link";

export function MyBreadCrumb() {
  const path = usePathname().split("/");
  const title = {
    overview: "活动总览",
    chat: "在线聊天",
    file_share: "资料分享",
    reimbursement: "费用报销",
    survey: "问卷调查",
  }[path.at(path.length - 1)!];
  return (
    <Breadcrumb
      items={[
        { title: <Link href=".">我参加的活动</Link> },
        { title: <Link href=".">奥林匹克森林公园团建</Link> },
        { title: title },
      ]}
    />
  );
}
