import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  addGroup,
  deleteGroup,
  onSelectChange,
  searchUser,
  selectAllUserGroup,
  updateGroupInfo,
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

  function getUserGroupData(): Omit<UserGroupType, "mentionProps" | "id">[] {
    return group;
  }

  const UserGroupsInput = (
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
  return { UserGroupsInput, getUserGroupData };
}

function SingleUserGroupComponent(
  userGroup: UserGroupType,
  dispatch: ReturnType<typeof useAppDispatch>,
  firstId: number,
) {
  async function _onChange(prefix: string) {
    const usernameList = prefix
      .split("@")
      .filter((e) => e !== "")
      .map((e) => e.trim());
    dispatch(onSelectChange({ groupId: userGroup.id, usernameList }));
    console.log(prefix);
    if (prefix.indexOf("@") !== -1) {
      prefix = prefix.slice(prefix.lastIndexOf("@") + 1);
    }
    console.log(prefix);
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
    dispatch(searchUser({ groupId: userGroup.id, data }));
  }

  let onChange = debounce(_onChange, 500);
  return (
    <li key={userGroup.id} className="flex flex-col my-[20px]">
      <div className="flex">
        <Input
          type="text"
          defaultValue={userGroup.groupName}
          className="w-[100px] mx-[10px]"
        />
        <Mentions
          onChange={onChange}
          autoSize
          options={userGroup.mentionProps}
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
      </div>
      <Input.TextArea
        defaultValue={userGroup.info}
        onChange={(e) => {
          dispatch(updateGroupInfo({ id: userGroup.id, info: e.target.value }));
        }}
        className="w-[400px] ml-[120px] my-[10px]"
      />
    </li>
  );
}
