"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const last_segment = path.split("/").slice(-1)[0];
  const card_title = {
    login: "登录帐号",
    register: "注册帐号",
  }[last_segment];
  return (
    <div
      className="w-screen h-screen flex justify-around items-center"
      style={{ background: "linear-gradient(122deg, #FAD6D6 6%, #ACD6FD 97%)" }}
    >
      <div className="flex justify-around items-center min-w-[1400px]">
        <div className="bg-transparent flex flex-col items-center w-[400px]">
          <Image src="/logo.svg" alt="logo" width={600} height={600} />
          <div
            className="text-[48px] font-[500] flex flex-col justify-center items-center w-[400px]mt-[60px]"
            style={{ textShadow: "0 4px 10px rgba(0, 0, 0, 0.3)" }}
          >
            <span>欢迎使用</span>
            <span>活动规划安排系统</span>
          </div>
        </div>
        <div className="w-[500px] h-[500px] shadow-xl shadow-black/30 rounded-[10px] bg-white flex flex-col">
          <div className="bg-[#E1DBEC] w-full h-[60px] flex justify-center items-center rounded-t-[10px] text-[30px]">
            {card_title}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
