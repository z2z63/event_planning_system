"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createActivity,
  createAttachment,
  createReimbursement,
  disconnectUserUserGroup,
  getActivityById,
  getActivityByUserId,
  getActivityNameById,
  getAttachmentListByActivityId,
  getReimbursementListByActivityIdAndUserId,
  getUserGroupInActivityByUserId,
  getUsersByPrefix,
  username2Id,
} from "@/app/lib/data";
import { OverviewFormDataType } from "@/app/(with_session)/activity/create/OverviewForm";
import { UserGroupType } from "@/app/(with_session)/activity/create/UserGroupSlice";
import { TimelineType } from "@/app/(with_session)/activity/create/TimelineSlice";
import { Activity, Agenda } from "@prisma/client";
import Decimal from "decimal.js";
import { CardData } from "@/app/(with_session)/HomePage";
import * as jose from "jose";

export async function signOut() {
  cookies().delete("jwt");
  redirect("/account/login");
}

export async function searchUsersByPrefix(
  prefix: string,
): Promise<{ id: number; username: string }[]> {
  if (prefix === "") {
    return [];
  }
  return getUsersByPrefix(prefix);
}

export async function newActivity(
  overviewFormData: OverviewFormDataType,
  editorData: string,
  userGroups: Omit<UserGroupType, "mentionProps" | "id">[],
  agendaData: Omit<TimelineType, "id">[],
) {
  const activity: Omit<Activity, "expenditure" | "id"> = {
    startTime: overviewFormData.startTime,
    endTime: overviewFormData.endTime,
    info: editorData,
    name: overviewFormData.activityName,
    blobId: overviewFormData.fileId,
    budget: new Decimal(overviewFormData.budget),
  };
  const newUserGroups: {
    groupName: string;
    info: string;
    userIdList: number[];
  }[] = [];
  for (const userGroup of userGroups) {
    newUserGroups.push({
      ...userGroup,
      userIdList: await username2Id(userGroup.selected),
    });
  }
  const newAgendaData: Omit<Agenda, "activityId" | "id">[] = [];
  for (const agenda of agendaData) {
    newAgendaData.push({
      name: agenda.agendaName,
      info: agenda.content,
      startTime: agenda.startTime!,
      endTime: agenda.endTime!,
    });
  }
  const record = await createActivity(activity, newUserGroups, newAgendaData);
  return record.id;
}

export async function getActivityCardData(userId: number): Promise<CardData[]> {
  const rawDataList = await getActivityByUserId(userId);
  const now = Date.now();
  return rawDataList.map((e) => {
    let status: "planning" | "progressing" | "ended";
    if (now <= e.startTime.getTime()) {
      status = "planning";
    } else if (now <= e.endTime.getTime()) {
      status = "progressing";
    } else {
      status = "ended";
    }
    return {
      id: e.id,
      title: e.name,
      organizers: e.ParticipantGroup.find((e) => e.seq === 0)!.participants.map(
        (e) => e.username,
      ),
      status: status,
      imgId: e.blobId,
    };
  });
}

export async function getActivityTitleName(id: number) {
  const data = await getActivityNameById(id);
  if (data === null) {
    throw new Error("Activity not found");
  }
  return data.name;
}

export async function getActivityBasicInfo(id: number) {
  const data = await getActivityById(id);
  if (data === null) {
    throw new Error("Activity not found");
  }
  return data;
}

export async function deleteUserInUserGroup(userId: number, groupId: number) {
  const record = await disconnectUserUserGroup(userId, groupId);
  console.log(record);
}

export async function uploadAttachment(
  blobId: number,
  visibility: number,
  activityId: number,
  filename: string,
  fileSize: number,
) {
  const { username: _, id: userId } = await getJWT();
  // check if the user is in the activity
  const group = await getUserGroupInActivityByUserId(userId, activityId);
  await createAttachment(activityId, filename, visibility, blobId, fileSize);
}

export async function getJWT() {
  const jwt = cookies().get("jwt")?.value;
  if (jwt === undefined) {
    throw Error("not login");
  }

  return jose.decodeJwt<{ username: string; id: number }>(jwt);
}

export async function getAttachmentList(activityId: number) {
  const { username: _, id: userId } = await getJWT();
  const group = await getUserGroupInActivityByUserId(userId, activityId);
  const allFiles = await getAttachmentListByActivityId(activityId);
  return allFiles.filter((e) => isVisible(e.visibility, group.seq));
}

function isVisible(visibility: bigint, groupSeq: number) {
  return (visibility & (BigInt(1) << BigInt(groupSeq))) !== BigInt(0);
}

export async function newReimbursement(
  activityId: number,
  title: string,
  amount: string,
  info: string,
  blobIdList: number[],
) {
  const { username: _, id: userId } = await getJWT();
  await getUserGroupInActivityByUserId(userId, activityId); // 检查用户是否在活动中
  await createReimbursement(
    userId,
    activityId,
    title,
    new Decimal(amount),
    info,
    blobIdList,
  );
}

export async function getReimbursementList(activityId: number) {
  const { username: _, id: userId } = await getJWT();
  await getUserGroupInActivityByUserId(userId, activityId); // 检查用户是否在活动中
  return getReimbursementListByActivityIdAndUserId(activityId, userId);
}
