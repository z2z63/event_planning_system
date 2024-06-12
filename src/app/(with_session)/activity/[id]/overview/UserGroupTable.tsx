"use client";
import { ActivityData } from "@/app/(with_session)/activity/[id]/overview/page";
import { Button, Table, TableColumnsType } from "antd";
import { deleteUserInUserGroup } from "@/app/(with_session)/action";
import { useState } from "react";

export function UserGroupTable({
  data,
  className,
}: {
  data: ActivityData;
  className?: string;
}) {
  const [groups, setGroups] = useState(data.ParticipantGroup);
  const columns: TableColumnsType<(typeof groups)[0]> = [
    {
      title: "组名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "组人数",
      render: (value, record, index) => {
        return record.participants.length;
      },
      key: "participants",
    },
    {
      title: "组序号",
      dataIndex: "seq",
      key: "seq",
    },
    {
      title: "说明",
      dataIndex: "info",
      key: "info",
    },

    {
      title: "操作",
      render: (value, record, index) => {
        return (
          <div className="flex">
            <Button type="link">编辑</Button>
            <Button type="text" danger>
              删除
            </Button>
          </div>
        );
      },
      key: "action",
    },
  ];

  function expandedRowRender(
    record: (typeof groups)[0],
    index1: number,
    indent: number,
    expanded: boolean,
  ) {
    function handleDelete(userId: number) {
      return async () => {
        await deleteUserInUserGroup(userId, record.id, data.id);
        setGroups(
          groups.map((e) => {
            if (e.id === record.id) {
              return {
                ...e,
                participants: e.participants.filter((e) => e.id !== userId),
              };
            }
            return e;
          }),
        );
      };
    }

    const columns: TableColumnsType<{
      id: number;
      username: string;
    }> = [
      {
        title: "组成员",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "操作",
        render: (value, record, index) => {
          return (
            <Button type="text" danger onClick={handleDelete(record.id)}>
              删除
            </Button>
          );
        },
        key: "action",
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={groups[index1].participants.map((e) => ({
          ...e,
          key: e.id,
        }))}
        pagination={false}
        bordered
      />
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col">
        <span className="text-[24px] mx-[10px]">用户组</span>
        <Table
          columns={columns}
          dataSource={groups.map((e) => ({ ...e, key: e.seq }))}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: [0],
            indentSize: 200,
          }}
          pagination={false}
          bordered
          className="mt-[20px]"
        />
      </div>
    </div>
  );
}
