import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  addGroup,
  deleteGroup,
  searchUser,
  selectAllUserGroup,
  UserGroupType,
} from "@/app/(with_session)/activity/create/UserGroupSlice";
import { Button, Input, List, Mentions } from "antd";
import { searchUsersByPrefix } from "@/app/(with_session)/action";
import { debounce } from "lodash";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";

export default function useUserGroupsInput() {
  const group = useAppSelector(selectAllUserGroup);
  const dispatch = useAppDispatch();
  return (
    <>
      <List
        dataSource={group}
        renderItem={(u) =>
          SingleUserGroupComponent(u, dispatch, group.at(0)!.id)
        }
        split
        header={<span className="mx-[40px] text-[18px]">添加用户</span>}
      />

      <Button
        onClick={() => {
          dispatch(addGroup());
          setTimeout(() => {
            window.scroll({
              behavior: "smooth",
              top: document.body.scrollHeight,
            });
          }, 100);
        }}
        type="primary"
        size="large"
        className="ml-[200px] my-[20px]"
      >
        添加用户组
      </Button>
    </>
  );
}

function SingleUserGroupComponent(
  userGroup: UserGroupType,
  dispatch: ReturnType<typeof useAppDispatch>,
  firstId: number,
) {
  async function _onChange(prefix: string) {
    if (prefix.indexOf("@") !== -1) {
      prefix = prefix.slice(prefix.lastIndexOf("@") + 1);
    }
    if (prefix === "") {
      return;
    }
    let data = (await searchUsersByPrefix(prefix)).map((e) => {
      return {
        label: e.username,
        value: e.username,
        key: e.id.toString(),
      };
    });
    console.log(data);
    dispatch(searchUser({ id: userGroup.id, data }));
  }

  let onChange = debounce(_onChange, 500);
  return (
    <li key={userGroup.id} className="flex my-[20px]">
      <Input
        type="text"
        value={userGroup.groupName}
        className="w-[100px] mx-[10px]"
      />
      <Mentions
        onChange={onChange}
        options={userGroup.data}
        className="w-[400px]"
        placeholder="输入@+用户名开始添加用户"
      />
      {firstId != userGroup.id && (
        <Button
          icon={<DeleteOutlined />}
          danger
          className="mx-[10px]"
          onClick={() => dispatch(deleteGroup(userGroup.id))}
        />
      )}
    </li>
  );
}
