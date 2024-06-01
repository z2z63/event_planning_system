import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StyleDowngrade from "./StyleDowngrade";
import { StoreProvider } from "@/app/StoreProvider";

export const metadata: Metadata = {
  title: "活动安排规划系统",
  description: "软件工程课程设计",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <StyleDowngrade>
          <AntdRegistry>
            <StoreProvider>{children}</StoreProvider>
          </AntdRegistry>
        </StyleDowngrade>
      </body>
    </html>
  );
}
