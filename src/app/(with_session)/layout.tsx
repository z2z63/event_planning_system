import React from "react";
import Image from "next/image";
import { Avatar, Button, Popover } from "antd";
import dayjs from "dayjs";
import * as jose from "jose";
import { cookies } from "next/headers";
import { PopUpAvatar } from "@/app/(with_session)/popup_avatar";

export default async function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jwt = cookies().get("jwt")!.value;
  const secret = new TextEncoder().encode(process.env.SECRET);

  const payload: jose.JWTPayload & { username: string } = jose.decodeJwt(jwt);
  return (
    <div className="flex flex-col">
      <header className="w-full flex justify-between border-b-[1px] border-black">
        <div className="flex justify-around items-center px-[10px]">
          <Image src="/logo.svg" width={80} height={80} alt="logo" />
          <span className="text-[30px] w-[4em]">活动安排规划系统</span>
        </div>
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
      {children}
    </div>
  );
}
