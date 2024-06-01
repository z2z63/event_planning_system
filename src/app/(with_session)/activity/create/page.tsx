"use client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  TimePicker,
  Upload,
  Mentions,
  List,
  Steps,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { searchUsersByPrefix } from "@/app/(with_session)/action";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector, useAppStore } from "@/app/hook";
import {
  addGroup,
  deleteGroup,
  searchUser,
  selectAllUserGroup,
  UserGroupType,
} from "@/app/(with_session)/activity/create/slice";

export default function Page() {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <Form
          className="mt-[30px]"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          size="large"
        >
          <Form.Item name="activityName" label="活动名称">
            <Input
              type="text"
              placeholder="请输入活动名称"
              className="w-[400px]"
            />
          </Form.Item>
          <Form.Item name="startTime" label="活动开始时间">
            <div>
              <DatePicker
                placeholder="请选择活动开始日期"
                className="w-[200px] mr-[20px]"
              />
              <TimePicker placeholder="请活动开始时间" />
            </div>
          </Form.Item>
          <Form.Item name="endTime" label="活动结束时间">
            <div>
              <DatePicker
                placeholder="请选择活动结束日期"
                className="w-[200px] mr-[20px]"
              />
              <TimePicker placeholder="请活动结束时间" />
            </div>
          </Form.Item>
          <Form.Item name="budget" label="初始预算额度">
            <InputNumber placeholder="0" />
          </Form.Item>
          <Form.Item name="file" label="活动封面">
            <Upload>
              <Button className="bg-none border-dashed w-[200px] h-[200px]">
                <PlusOutlined />
                <div className="mt-[8px]">点击上传图像</div>
              </Button>
            </Upload>
          </Form.Item>
        </Form>
        <UserGroupComponentList />
      </div>
      <AgendaInput />
    </div>
  );
}

function UserGroupComponentList() {
  const group = useAppSelector((state) => selectAllUserGroup(state));
  const dispatch = useAppDispatch();
  return (
    <div>
      <List
        dataSource={group}
        renderItem={(u) => UserGroupComponent(u, dispatch, group.at(0)!.id)}
        split
        header={<span className="mx-[40px] text-[18px]">添加用户</span>}
      />

      <Button
        onClick={() => dispatch(addGroup())}
        type="primary"
        size="large"
        className="ml-[200px] my-[20px]"
      >
        添加用户组
      </Button>
    </div>
  );
}

function UserGroupComponent(
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

function AgendaInput() {
  const description = "This is a description.";
  return (
    <Steps
      direction="vertical"
      className="w-[800px]"
      current={1}
      items={[
        {
          title: "Finished",
          description,
        },
        {
          title: "In Progress",
          description,
        },
        {
          title: "Waiting",
          description,
        },
      ]}
    />
  );
}
