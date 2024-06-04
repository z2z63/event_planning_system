import prisma from "./db";
import * as crypto from "node:crypto";
import { md5 } from "js-md5";
import { Activity, Agenda } from "@prisma/client";

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
}) {
  const user = await getUserByUsername(username);
  if (user === null) {
    return false;
  }
  return passwordHash(password, user.salt) === user.hash;
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
  const buffer = await prisma.blob.findUnique({
    select: {
      data: true,
    },
    where: {
      id,
    },
  });
  return buffer?.data;
}

export async function createBlob(data: Buffer) {
  const { id } = await prisma.blob.create({
    data: {
      data,
    },
  });
  return id;
}

export async function createActivity(
  activity: Omit<Activity, "expenditure">,
  usersId: number[],
  agenda: Omit<Agenda, "activityId" | "id">,
) {
  return prisma.activity.create({
    data: activity,
  });
}
