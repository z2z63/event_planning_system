"use server";
import { createUser, verifyCredentials } from "@/app/lib/data";
import * as jose from "jose";
import { cookies } from "next/headers";
import { FieldType as LoginFieldType } from "@/app/account/login/page";
import { FieldType as RegisterFieldType } from "@/app/account/register/page";

const secret = new TextEncoder().encode(process.env.SECRET);

export async function server_login(data: LoginFieldType, token: string) {
  console.log(data);
  if (!(await recaptcha_verify(token))) {
    return false;
  }
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

export async function server_register(data: RegisterFieldType, token: string) {
  if (!(await recaptcha_verify(token))) {
    return false;
  }
  try {
    await createUser(data);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

type ReCAPTCHAResponse = {
  success: true | false;
  challenge_ts: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  hostname: string; // the hostname of the site where the reCAPTCHA was solved
  "error-codes": any; // optional
};

async function recaptcha_verify(token: string) {
  if (token === undefined || token === "") {
    return false;
  }
  const url = "https://www.google.com/recaptcha/api/siteverify";
  const formData = new FormData();
  formData.set("secret", process.env.RECAPTCHA_SECRET_KEY);
  formData.set("response", token);
  const resp = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const json: ReCAPTCHAResponse = await resp.json();
  console.log(json);
  return json.success;
}
