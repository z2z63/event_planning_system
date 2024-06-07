"use client";

import { usePathname } from "next/navigation";
import {
  ClassAttributes,
  HTMLAttributes,
  JSX,
  useEffect,
  useState,
} from "react";
import { getActivityTitleName } from "@/app/(with_session)/action";

export function HeadTitle(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLSpanElement> &
    HTMLAttributes<HTMLSpanElement>,
) {
  const path = usePathname();
  console.log(path);
  const [title, setTitle] = useState("");
  const [lastId, setLastId] = useState(-1);
  if (path === "/" && title !== "活动列表") {
    setTitle("活动列表");
  } else if (path === "/activity/create" && title !== "创建活动") {
    setTitle("创建活动");
  }
  useEffect(() => {
    if (path.search("/activity/\\d+/.*") !== -1) {
      const id = Number(path.split("/")[2]);
      if (id === lastId) {
        return;
      }
      setLastId(id);
      getActivityTitleName(id).then(setTitle);
    }
  }, [lastId, path]);
  return <span {...props}>{title}</span>;
}
