"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUsersByPrefix } from "@/app/lib/data";

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
