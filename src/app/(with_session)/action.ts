"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createActivity,
  createAttachment,
  createReimbursement,
  createSurvey,
  createSurveyFillOut,
  disconnectUserUserGroup,
  getActivityById,
  getActivityByUserId,
  getActivityIdByReimbursementId,
  getActivityNameById,
  getAttachmentListByActivityId,
  getPendingReimbursementsByActivityId,
  getReimbursementListByActivityIdAndUserId,
  getSurvey,
  getSurveyFillOutBySurveyId,
  getSurveyListByActivityId,
  getUserGroupInActivityByUserId,
  getUsersByPrefix,
  updateExpenditure,
  updateReimbursementStatus,
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
  const groups = await getUserGroupInActivityByUserId([userId], activityId);
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
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
  const groups = await getUserGroupInActivityByUserId([userId], activityId);
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
  const allFiles = await getAttachmentListByActivityId(activityId);
  return allFiles.filter((e) => isVisible(e.visibility, groups[0].seq));
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
  const groups = await getUserGroupInActivityByUserId([userId], activityId); // 检查用户是否在活动中
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
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
  const groups = await getUserGroupInActivityByUserId([userId], activityId); // 检查用户是否在活动中
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
  return (
    await getReimbursementListByActivityIdAndUserId(activityId, userId)
  ).map((e) => ({
    ...e,
    amount: e.amount.toString(),
  }));
}

export async function getPendingReimbursementList(activityId: number) {
  const { username: _, id: userId } = await getJWT();
  const handler1sGroups = await getUserGroupInActivityByUserId(
    [userId],
    activityId,
  ); // 检查用户是否在活动中
  if (handler1sGroups.length === 0) {
    throw new Error("user not in activity");
  }
  if (handler1sGroups[0].seq !== 0) {
    throw new Error("only organizer can handle reimbursement");
  }
  const records = await getPendingReimbursementsByActivityId(activityId);

  const applicant1sGroupList: {
    name: string;
    id: number;
    participants: {
      id: number;
      username: string;
    }[];
  }[] = await getUserGroupInActivityByUserId(
    records.map((e) => e.userId),
    activityId,
  );

  function getUser1sGroup(userId: number) {
    const group = applicant1sGroupList.find((group) =>
      group.participants.find((user) => user.id === userId),
    );
    if (group === undefined) {
      throw new Error("user not in activity");
    }
    return group;
  }

  return records.map((e, i) => {
    const group = getUser1sGroup(e.userId);
    return {
      ...e,
      amount: e.amount.toString(),
      user: {
        id: e.user.id,
        username: e.user.username,
        group: {
          id: group.id,
          name: group.name,
        },
      },
    };
  });
}

export async function handleReimbursement(
  reimbursementId: number,
  comment: string,
  status: "REJECTED" | "APPROVED",
) {
  const { username: _, id: handlerId } = await getJWT();
  const activityId = await getActivityIdByReimbursementId(reimbursementId);
  if (activityId === undefined) {
    throw new Error("activity not found");
  }
  const handler1sGroups = await getUserGroupInActivityByUserId(
    [handlerId],
    activityId,
  ); // 检查用户是否在活动中
  if (handler1sGroups[0].seq !== 0) {
    throw new Error("only organizer can handle reimbursement");
  }
  const reimbursement = await updateReimbursementStatus(
    reimbursementId,
    handlerId,
    comment,
    status,
  );
  if (reimbursement.status === "APPROVED") {
    await updateExpenditure(activityId, reimbursement.amount);
  }
}

export async function newSurvey(
  activityId: number,
  visibility: bigint,
  model: string,
) {
  const { username: _, id: creatorId } = await getJWT();
  const groups = await getUserGroupInActivityByUserId([creatorId], activityId); // 检查用户是否在活动中
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
  if (groups[0].seq !== 0) {
    throw new Error("only organizer can create survey");
  }
  const title = JSON.parse(model)?.title || "未命名问卷";
  await createSurvey(activityId, title, visibility, model, creatorId);
}

export async function getSurveyList(activityId: number) {
  const { username: _, id: userId } = await getJWT();
  const groups = await getUserGroupInActivityByUserId([userId], activityId); // 检查用户是否在活动中
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
  return getSurveyListByActivityId(activityId);
}

export async function getSurveyModel(surveyId: number) {
  const { username: _, id: userId } = await getJWT();
  const survey = await getSurvey(surveyId);
  if (survey === null) {
    throw new Error("survey not found");
  }
  const groups = await getUserGroupInActivityByUserId(
    [userId],
    survey.activityId,
  ); // 检查用户是否在活动中
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
  return survey;
}

export async function completeSurvey(surveyId: number, fillOut: string) {
  const { username: _, id: userId } = await getJWT();
  const survey = await getSurvey(surveyId);
  if (survey === null) {
    throw new Error("survey not found");
  }
  const groups = await getUserGroupInActivityByUserId(
    [userId],
    survey.activityId,
  ); // 检查用户是否在活动中
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
  await createSurveyFillOut(surveyId, fillOut, userId);
}

export async function getSurveyResults(surveyId: number) {
  const { username: _, id: userId } = await getJWT();
  const survey = await getSurvey(surveyId);
  if (survey === null) {
    throw new Error("survey not found");
  }
  const groups = await getUserGroupInActivityByUserId(
    [userId],
    survey.activityId,
  ); // 检查用户是否在活动中
  if (groups.length === 0) {
    throw new Error("user not in activity");
  }
  return getSurveyFillOutBySurveyId(surveyId);
}
