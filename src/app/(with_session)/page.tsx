import { getActivityCardData } from "@/app/(with_session)/action";
import * as jose from "jose";
import { cookies } from "next/headers";
import HomePage from "@/app/(with_session)/HomePage";

export default async function Page() {
  const jwt = cookies().get("jwt")?.value;
  if (jwt === undefined) {
    throw Error("not login");
  }

  const payload: jose.JWTPayload & { username: string; id: number } =
    jose.decodeJwt(jwt);
  const data = await getActivityCardData(payload.id);
  return <HomePage data={data} />;
}
