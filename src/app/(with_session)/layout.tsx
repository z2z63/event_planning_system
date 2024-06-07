import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import * as jose from "jose";
import { cookies } from "next/headers";
import { PopUpAvatar } from "@/app/(with_session)/PopupAvatar";
import Link from "next/link";
import SessionProvider from "@/app/(with_session)/SessionProvider";
import { HeadTitle } from "@/app/(with_session)/HeadTitle";

export default async function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jwt = cookies().get("jwt")?.value;
  if (jwt === undefined) {
    throw Error("not login");
  }

  const payload: jose.JWTPayload & { username: string; id: number } =
    jose.decodeJwt(jwt);
  return (
    <div className="flex flex-col">
      <header className="w-full flex justify-between items-center border-b-[1px] border-black">
        <Link href="/" className="flex justify-around items-center px-[10px]">
          <Image
            src="/logo.svg"
            width={80}
            height={80}
            alt="logo"
            className="h-[80px]"
          />
          <span className="ml-[10px] text-[24px] w-[4em]">
            活动安排规划系统
          </span>
        </Link>
        <HeadTitle className="text-[32px]" />
        <div className="flex justify-around items-center">
          <div className="flex flex-col">
            <span className="text-[18px] mb-[5px]">
              欢迎您，{payload.username}
            </span>
            <span className="text-[#878686] text-[12px]">
              {dayjs().format("YYYY[年]M[月]D[日]")}
            </span>
          </div>
          <div className="m-[10px]">
            <PopUpAvatar username={payload.username} />
          </div>
        </div>
      </header>
      <SessionProvider session={payload}>{children}</SessionProvider>
    </div>
  );
}
