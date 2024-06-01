"use client";
import React from "react";
import { StyleProvider } from "@ant-design/cssinjs";

export default function StyleDowngrade({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyleProvider layer>{children}</StyleProvider>;
}
