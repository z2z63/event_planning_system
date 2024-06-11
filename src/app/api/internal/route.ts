import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/app/lib/data";

export async function GET(request: NextRequest) {
  console.log(request);
  if (request.nextUrl.searchParams.has("createUsers")) {
    await createUsers();
    return new NextResponse("ok");
  }
}

async function createUsers() {
  const UserList = [
    {
      username: "张三",
      password: "zhansan",
    },
    {
      username: "李四",
      password: "lisi",
    },
    {
      username: "王五",
      password: "wangwu",
    },
    {
      username: "李华",
      password: "lihua",
    },
    {
      username: "小明",
      password: "xiaoming",
    },
  ];
  await Promise.all(UserList.map((user) => createUser(user)));
}
