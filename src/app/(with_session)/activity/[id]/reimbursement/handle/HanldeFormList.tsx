"use client";

import { Reimbursement } from "@prisma/client";
import { Button, Descriptions, Form, Image, Input, List } from "antd";
import React, { useState } from "react";
import { DescriptionsItemType } from "antd/es/descriptions";
import dayjs from "dayjs";
import { handleReimbursement } from "@/app/(with_session)/action";

type ReimbursementModified = Omit<Reimbursement, "amount"> & {
  amount: string;
  user: {
    username: string;
    id: number;
    group: {
      id: number;
      name: string;
    };
  };
  blobs: {
    id: number;
    filename: string;
  }[];
};

export function HandleFormList({ data }: { data: ReimbursementModified[] }) {
  const [newData, setNewData] = useState(data);
  const [commentList, setCommentList] = useState<string[]>(
    Array(data.length).fill(""),
  );

  function HandleForm(data: ReimbursementModified, index: number) {
    function onFinish(status: "REJECTED" | "APPROVED") {
      return async () => {
        await handleReimbursement(data.id, commentList[index], status);
        setCommentList(commentList.filter((_, i) => i !== index));
        setNewData(newData.filter((_, i) => i !== index));
      };
    }

    function onCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      const value = e.target.value;
      setCommentList(commentList.map((e, i) => (i === index ? value : e)));
    }

    const items: DescriptionsItemType[] = [
      {
        label: "报销名称",
        children: data.title,
      },
      {
        label: "报销人",
        children: data.user.username,
      },
      {
        label: "报销人所属组",
        children: data.user.group.name,
      },
      {
        label: "报销金额",
        children: data.amount + "￥",
      },
      {
        label: "申请时间",
        children: dayjs(data.submitTime).format("YYYY年MM月DD日HH时MM分"),
        span: 2,
      },
      {
        label: "报销说明",
        children: (
          <div
            className="prose-sm"
            dangerouslySetInnerHTML={{ __html: data.info }}
          />
        ),
        span: 3,
      },
      {
        label: "报销附件",
        children: <AttachmentList blobs={data.blobs} />,
        span: 3,
      },
      {
        label: "操作",
        children: (
          <Form onFinish={onFinish}>
            <Form.Item name="comment" label="附言">
              <Input.TextArea
                onChange={onCommentChange}
                className="w-[600px] h-[150px] max-h-[300px]"
              />
            </Form.Item>
            <Form.Item name="action">
              <div className="flex justify-around items-center w-[300px]">
                <Button type="primary" onClick={onFinish("APPROVED")}>
                  批准
                </Button>
                <Button danger onClick={onFinish("REJECTED")}>
                  拒绝
                </Button>
              </div>
            </Form.Item>
          </Form>
        ),
      },
    ];
    return (
      <Descriptions
        key={data.id}
        items={items}
        bordered
        className="w-[1000px] my-[20px]"
      />
    );
  }

  return (
    <List dataSource={newData} renderItem={HandleForm} className="ml-[100px]" />
  );
}

function AttachmentList({
  blobs,
}: {
  blobs: { filename: string; id: number }[];
}) {
  function itemRender1(item: { filename: string; id: number }) {
    return (
      <Image
        src={`/api/blob/${item.id}`}
        alt={item.filename}
        width={300}
        height={300}
        className="shadow shadow-[#0000004C] block"
      />
    );
  }

  function itemRender2(item: { filename: string; id: number }) {
    return (
      <Button
        type="link"
        href={`/api/blob/${item.id}`}
        download={item.filename}
        className="mx-[20px] my-[10px] block"
      >
        {item.filename}
      </Button>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex">
        {blobs.filter((e) => !isImage(e)).map(itemRender2)}
      </div>
      {blobs.filter(isImage).length > 0 && (
        <List
          dataSource={blobs.filter(isImage)}
          renderItem={itemRender1}
          itemLayout="vertical"
        />
      )}
    </div>
  );
}

function isImage({ filename, id }: { filename: string; id: number }) {
  const ext = filename.split(".").pop() ?? "";
  return ["png", "jpg", "jpeg", "gif", "bmp"].includes(ext);
}
