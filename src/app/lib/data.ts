import prisma from "./db";
import * as crypto from "node:crypto";
import { md5 } from "js-md5";

export async function createUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = passwordHash(password , salt);
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
  return passwordHash(password , user.salt) === user.hash;
}


export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

function passwordHash(password:string, salt:string){
  return md5(password + salt);
}
