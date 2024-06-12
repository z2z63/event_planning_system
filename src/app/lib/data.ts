"use server";
import prisma from "./db";
import * as crypto from "node:crypto";
import { md5 } from "js-md5";
import { Activity, Agenda } from "@prisma/client";
import Decimal from "decimal.js";

export async function createUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = passwordHash(password, salt);
  await prisma.user.create({
    data: { username, salt, hash },
  });
}

export async function verifyCredentials({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ passed: false } | { passed: true; id: number }> {
  const user = await getUserByUsername(username);
  if (user === null) {
    return { passed: false };
  }
  if (passwordHash(password, user.salt) !== user.hash) {
    return { passed: false };
  }
  return { passed: true, id: user.id };
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

function passwordHash(password: string, salt: string) {
  return md5(password + salt);
}

export async function getUsersByPrefix(prefix: string) {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
    where: {
      username: {
        startsWith: prefix,
      },
    },
  });
}

export async function getBlobById(id: number) {
  return prisma.blob.findUnique({
    where: {
      id,
    },
  });
}

export async function createBlob(data: Buffer, filename: string) {
  const { id } = await prisma.blob.create({
    data: {
      filename,
      data,
    },
  });
  return id;
}

export async function username2Id(usernameList: string[]) {
  const data = await prisma.user.findMany({
    select: {
      id: true,
    },
    where: {
      username: {
        in: usernameList,
      },
    },
  });
  return data.map((e) => e.id);
}

export async function createActivity(
  activity: Omit<Activity, "expenditure" | "id">,
  userGroup: { groupName: string; info: string; userIdList: number[] }[],
  agenda: Omit<Agenda, "activityId" | "id">[],
) {
  return prisma.activity.create({
    data: {
      ...activity,
      Agenda: {
        create: agenda,
      },
      ParticipantGroup: {
        create: userGroup.map((e, i) => ({
          name: e.groupName,
          info: e.info,
          seq: i,
          participants: {
            connect: e.userIdList.map((u) => ({ id: u })),
          },
        })),
      },
    },
  });
}

export async function getActivityByUserId(userId: number) {
  return prisma.activity.findMany({
    where: {
      ParticipantGroup: {
        some: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
    include: {
      ParticipantGroup: {
        where: {
          seq: 0,
        },
        include: {
          participants: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
}

export async function getActivityById(activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
    include: {
      ParticipantGroup: {
        include: {
          participants: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      Agenda: true,
    },
  });
}

export async function getActivityNameById(activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
    select: {
      name: true,
    },
  });
}

export async function disconnectUserUserGroup(userId: number, groupId: number) {
  return prisma.userGroup.update({
    where: {
      id: groupId,
    },
    data: {
      participants: {
        disconnect: {
          id: userId,
        },
      },
    },
    include: {
      participants: true,
    },
  });
}

export async function getAttachmentListByActivityId(activityId: number) {
  return prisma.attachment.findMany({
    where: {
      activityId,
    },
    include: {
      blob: {
        select: {
          filename: true,
        },
      },
    },
  });
}

export async function createAttachment(
  activityId: number,
  filename: string,
  visibility: number,
  blobId: number,
  fileSize: number,
) {
  return prisma.activity.update({
    data: {
      Attachments: {
        create: {
          size: fileSize,
          blob: {
            connect: {
              id: blobId,
            },
          },
          visibility,
        },
      },
    },
    where: {
      id: activityId,
    },
  });
}

export async function getUserGroupInActivityByUserId(
  userIdList: number[],
  activityId: number,
) {
  return prisma.userGroup.findMany({
    where: {
      participants: {
        some: {
          id: {
            in: userIdList,
          },
        },
      },
      activityId,
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
}

export async function getUserGroupsByActivityId(activityId: number) {
  return prisma.userGroup.findMany({
    where: {
      activityId,
    },
  });
}

export async function deleteBlobById(blobId: number) {
  await prisma.blob.delete({
    where: {
      id: blobId,
    },
  });
}

export async function createReimbursement(
  userId: number,
  activityId: number,
  title: string,
  amount: Decimal,
  info: string,
  blobIdList: number[],
) {
  return prisma.reimbursement.create({
    data: {
      title,
      amount,
      info,
      blobs: {
        connect: blobIdList.map((e) => ({ id: e })),
      },
      activityId,
      status: "PENDING",
      userId,
    },
  });
}

export async function getReimbursementListByActivityIdAndUserId(
  activityId: number,
  userId: number,
) {
  return prisma.reimbursement.findMany({
    where: {
      activityId,
      userId,
    },
    include: {
      handler: {
        select: {
          username: true,
          id: true,
        },
      },
    },
  });
}

export async function getPendingReimbursementsByActivityId(activityId: number) {
  return prisma.reimbursement.findMany({
    where: {
      activityId,
      status: "PENDING",
    },
    include: {
      blobs: {
        select: {
          filename: true,
          id: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
}

export async function updateReimbursementStatus(
  reimbursementId: number,
  handlerId: number,
  comment: string,
  status: "REJECTED" | "APPROVED",
) {
  const now = new Date(Date.now());
  return prisma.reimbursement.update({
    data: {
      status,
      handleTime: now,
      comment: comment,
      handler: {
        connect: {
          id: handlerId,
        },
      },
    },
    where: {
      id: reimbursementId,
    },
  });
}

export async function updateExpenditure(activityId: number, amount: Decimal) {
  return prisma.activity.update({
    data: {
      expenditure: {
        increment: amount,
      },
    },
    where: {
      id: activityId,
    },
  });
}

export async function getActivityIdByReimbursementId(reimbursementId: number) {
  const record = await prisma.reimbursement.findUnique({
    where: {
      id: reimbursementId,
    },
    select: {
      activityId: true,
    },
  });
  return record?.activityId;
}

export async function createSurvey(
  activityId: number,
  title: string,
  visibility: bigint,
  model: string,
  creatorId: number,
) {
  return prisma.survey.create({
    data: {
      title,
      model,
      visibility,
      creator: {
        connect: {
          id: creatorId,
        },
      },
      activity: {
        connect: {
          id: activityId,
        },
      },
    },
  });
}

export async function getSurveyListByActivityId(activityId: number) {
  return prisma.survey.findMany({
    where: {
      activityId,
    },
    select: {
      creator: {
        select: {
          username: true,
          id: true,
        },
      },
      id: true,
      title: true,
      creatTime: true,
      activityId: true,
      visibility: true,
    },
  });
}

export async function getSurveyListByActivityIdAndUserId(
  activityId: number,
  userId: number,
) {
  return prisma.survey.findMany({
    where: {
      activityId,
      SurveyFillOut: {
        none: {
          userId,
        },
      },
    },
    select: {
      creator: {
        select: {
          username: true,
          id: true,
        },
      },
      id: true,
      title: true,
      creatTime: true,
      activityId: true,
      visibility: true,
    },
  });
}

export async function getSurvey(surveyId: number) {
  return prisma.survey.findUnique({
    where: {
      id: surveyId,
    },
  });
}

export async function createSurveyFillOut(
  surveyId: number,
  fillOut: string,
  userId: number,
) {
  return prisma.surveyFillOut.create({
    data: {
      fillOut,
      survey: {
        connect: {
          id: surveyId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getSurveyFillOutBySurveyId(surveyId: number) {
  return prisma.surveyFillOut.findMany({
    where: {
      surveyId,
    },
  });
}
