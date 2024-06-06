"use client";
import { Button, Input, Segmented, Select } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { SessionContext } from "@/app/(with_session)/SessionProvider";

export type CardData = {
  id: number;
  title: string;
  organizers: string[];
  status: "planning" | "progressing" | "ended";
  imgId: number;
};
export default function HomePage({ data }: { data: CardData[] }) {
  const session = useContext(SessionContext);
  const [statusFilter, setStatusFilter] = useState<
    "planning" | "progressing" | "ended" | null
  >(null);
  const [participateFilter, setParticipateFilter] = useState<
    "participate" | "organize"
  >("participate");
  return (
    <div className="flex flex-col">
      <div className="flex justify-around mt-[20px]">
        <Segmented
          size="large"
          options={[
            {
              label: "我参与的活动",
              value: "participate",
            },
            {
              label: "我组织的活动",
              value: "organize",
            },
          ]}
          onChange={setParticipateFilter}
        />
        <Input.Search
          size="large"
          className="max-w-[300px]"
          placeholder="请搜索活动名称"
        />
        <Select
          size="large"
          className="w-[200px]"
          placeholder="请选择活动状态"
          onChange={setStatusFilter}
        >
          <Select.Option value="planning">筹划中</Select.Option>
          <Select.Option value="progressing">进行中</Select.Option>
          <Select.Option value="ended">已结束</Select.Option>
        </Select>
        <Button size="large" type="primary" href="/activity/create">
          创建活动
        </Button>
      </div>
      <div className="flex flex-wrap w-full mx-[20px] mt-[20px]">
        {data
          .filter((e) => statusFilter === null || e.status === statusFilter)
          .filter((e) =>
            e.organizers.includes(session.username)
              ? participateFilter === "organize"
              : participateFilter === "participate",
          )
          .map(Card)}
      </div>
    </div>
  );
}

function Card(data: CardData) {
  let organizers = "";
  if (data.organizers.length == 1) {
    organizers = data.organizers[0];
  } else if (data.organizers.length > 1) {
    organizers = data.organizers.join("，");
  }
  const status = {
    planning: "筹划中",
    progressing: "进行中",
    ended: "已结束",
  }[data.status];
  const color = {
    planning: "#B8B7B5",
    progressing: "#3BA3DB",
    ended: "#000000",
  }[data.status];
  return (
    <Link
      href={`/activity/${data.id}`}
      className="bg-white w-[300px] h-[300px] rounded-[5px] m-[20px] flex flex-col hover:relative hover:bottom-[5px]"
      style={{ boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.3)" }}
      key={data.id}
    >
      <Image
        src={`/api/blob/${data.imgId}`}
        alt={"image of " + data.title}
        width={300}
        height={200}
        className="object-cover h-[200px] rounded-t-[5px]"
      />

      <div className="flex flex-col justify-between items-center flex-grow">
        <span className="text-[24px] my-[10px]">{data.title}</span>
        <div className="flex justify-between w-full p-[10px]">
          <span className="text-[#989797]">{organizers}</span>
          <div className="flex justify-between items-center">
            <div className={`h-[20px] w-[20px] rounded-full bg-[${color}]`} />
            <span>{status}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
