import Image from "next/image";
import React from "react";
import AccountFormCard from "@/app/account/AccountFormCard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <AccountFormCard>{children}</AccountFormCard>
      </div>
    </div>
  );
}
