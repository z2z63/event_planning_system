"use client";
import { Avatar, Button, Dropdown, Popover } from "antd";
import type { MenuProps } from "antd";
import React from "react";
import { signOut } from "@/app/(with_session)/action";

export function PopUpAvatar({ username }: { username: string }) {
  return (
    <Dropdown menu={{ items }}>
      <Avatar
        className="bg-[#ffbf00]"
        style={{ backgroundColor: "#ffbf00" }}
        size={50}
      >
        {username.at(0)}
      </Avatar>
    </Dropdown>
  );
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <Button type="text" onClick={() => (window.location.href = "/a")}>
        个人中心
      </Button>
    ),
  },
  {
    key: "2",
    label: (
      <Button type="text" danger onClick={async () => await signOut()}>
        退出登录
      </Button>
    ),
  },
];
