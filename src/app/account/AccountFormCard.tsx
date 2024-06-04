"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { env } from "next-runtime-env";

export default function AccountFormCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteKey = env("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
  if (siteKey === undefined) {
    throw Error("no google reCAPTCHA site key");
  }
  const path = usePathname();
  const last_segment = path.split("/").slice(-1)[0];
  const card_title = {
    login: "登录帐号",
    register: "注册帐号",
  }[last_segment];
  return (
    <div className="w-[500px] h-[500px] shadow-xl shadow-black/30 rounded-[10px] bg-white flex flex-col">
      <div className="bg-[#E1DBEC] w-full h-[60px] flex justify-center items-center rounded-t-[10px] text-[30px]">
        {card_title}
      </div>
      <GoogleReCaptchaProvider reCaptchaKey={siteKey} useRecaptchaNet>
        {children}
      </GoogleReCaptchaProvider>
    </div>
  );
}
