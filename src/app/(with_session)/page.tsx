"use client";

import { Button, Input, Segmented, Select } from "antd";
import Image from "next/image";
import assert from "node:assert";

type CardData = {
  title: string;
  organizers: string[];
  status: "planning" | "progressing";
  img: string;
};

export default function Home() {
  const data: CardData[] = [
    {
      title: "奥林匹克森林公园团建",
      organizers: ["李四", "王五"],
      status: "planning",
      img: "/activity1.png",
    },
    {
      title: "科技竞赛答辩",
      organizers: ["小明"],
      status: "progressing",
      img: "/activity2.png",
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="flex justify-around mt-[20px]">
        <Segmented size="large" options={["我参与的活动", "我组织的活动"]} />
        <Input.Search
          size="large"
          className="max-w-[300px]"
          placeholder="请搜索活动名称"
        />
        <Select size="large" className="w-[200px]" placeholder="请选择活动状态">
          <Select.Option value="planning">筹划中</Select.Option>
          <Select.Option value="progressing">进行中</Select.Option>
        </Select>
        <Button size="large" type="primary">
          创建活动
        </Button>
      </div>
      <div className="flex flex-wrap w-full mx-[20px] mt-[20px]">
        {data.map(Card)}
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
  }[data.status];
  const color = {
    planning: "#B8B7B5",
    progressing: "#3BA3DB",
  }[data.status];
  return (
    <div
      className="bg-white w-[300px] h-[300px] rounded-[5px] m-[20px] flex flex-col hover:relative hover:bottom-[5px]"
      style={{ boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.3);" }} key={data.title}
    >
      <Image
        src={data.img}
        alt={"image of " + data.title}
        width={300}
        height={255}
      />
      <div className="flex flex-col justify-between items-center flex-grow">
        <span className="text-[24px] my-[10px]">{data.title}</span>
        <div className="flex justify-between w-full p-[10px]">
          <span className="text-[#989797]">{organizers}</span>
          <div className="flex justify-between items-center">
            <div className={`h-[20px] w-[20px] rounded-full bg-[${color}]`}/>
            <span>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
