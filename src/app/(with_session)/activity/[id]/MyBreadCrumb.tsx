"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "antd";
import Link from "next/link";

export function MyBreadCrumb() {
  let path = usePathname();
  if (path[path.length - 1] === "/") {
    path = path.slice(0, path.length - 1);
  }
  const activityId = Number(path.match(/\/activity\/(\d+)/)?.[1] ?? "-1");
  if (activityId === -1) {
    throw new Error("Invalid path");
  }
  const pathLookupTable = {
    [`/activity/${activityId}/overview`]: [
      <Link href="." key="overview">
        活动总览
      </Link>,
    ],
    [`/activity/${activityId}/chat`]: [
      <Link href="." key="overview">
        在线聊天
      </Link>,
    ],
    [`/activity/${activityId}/file_share`]: [
      <Link href="." key="overview">
        资料分享
      </Link>,
    ],
    [`/activity/${activityId}/reimbursement$`]: [
      <Link href={path} key="overview">
        费用报销
      </Link>,
    ],
    [`/activity/${activityId}/reimbursement/create`]: [
      <Link href="." key="overview">
        费用报销
      </Link>,
      <Link href="." key="overview">
        申请经费报销
      </Link>,
    ],
    [`/activity/${activityId}/reimbursement/handle`]: [
      <Link href="." key="overview">
        费用报销
      </Link>,
      <Link href="." key="overview">
        经费报销记录
      </Link>,
    ],
    [`/activity/${activityId}/survey/fill-out-list`]: [
      <Link href="." key="overview">
        待填写问卷
      </Link>,
    ],
    [`/activity/${activityId}/survey/\\d+/fill-out`]: [
      <Link href="." key="overview">
        问卷填写
      </Link>,
    ],
    [`/activity/${activityId}/survey/create`]: [
      <Link href="." key="overview">
        创建问卷
      </Link>,
    ],
    [`/activity/${activityId}/survey/statistics-list`]: [
      <Link href="." key="overview">
        问卷统计总览
      </Link>,
    ],
    [`/activity/${activityId}/survey/\\d+/statistics`]: [
      <Link href="." key="overview">
        问卷统计
      </Link>,
    ],
  };
  let items = [
    { title: <Link href=".">我参加的活动</Link> },
    { title: <Link href=".">奥林匹克森林公园团建</Link> },
  ];
  for (const [key, value] of Object.entries(pathLookupTable)) {
    if (path.match(key)) {
      items = items.concat(value.map((e) => ({ title: e })));
      break;
    }
  }
  return <Breadcrumb items={items} />;
}
