"use server";
import { createUser, verifyCredentials } from "@/app/lib/data";
import * as jose from "jose";
import { cookies } from "next/headers";
import { FieldType as LoginFieldType } from "@/app/account/login/page";
import { FieldType as RegisterFieldType } from "@/app/account/register/page";

const secret = new TextEncoder().encode(process.env["SECRET"]);

export async function server_login(data: LoginFieldType) {
  if (!(await verifyCredentials(data))) {
    return false;
  }
  const alg = "HS256";
  const jwt = await new jose.SignJWT(data)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("2h")
    .sign(secret);
  cookies().set({
    name: "jwt",
    value: jwt,
    httpOnly: true,
    path: "/",
  });
  return true;
}

export async function server_register(data: RegisterFieldType) {
  try{
    await createUser(data);
  }catch (error){
    console.log(error);
    return false;
  }
  return true;
}
