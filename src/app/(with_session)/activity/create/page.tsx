"use client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  TimePicker,
  Upload,
  UploadFile,
} from "antd";
import React, { useState } from "react";
import useAgendaInput from "@/app/(with_session)/activity/create/AgendaInput";
import useUserGroupsInput from "@/app/(with_session)/activity/create/UserGroupsInput";
import useRichTextEditor from "@/app/(with_session)/activity/create/RichTextEditor";
import Image from "next/image";
import { PlusOutlined } from "@ant-design/icons";

export default function Page() {
  const AgendaInput = useAgendaInput();
  const UserGroupsInput = useUserGroupsInput();
  const RichTextEditor = useRichTextEditor();
  const [uploadId, setUploadId] = useState(-1);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  return (
    <div className="flex flex-col justify-around items-center">
      <div className="flex justify-around w-screen">
        <div className="flex flex-col ml-[200px]">
          <Form
            className="mt-[30px] w-[600px]"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 21 }}
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
              <div className="flex">
                <DatePicker
                  placeholder="请选择活动开始日期"
                  className="w-[200px] mr-[20px]"
                />
                <TimePicker
                  placeholder="请选择活动开始时间"
                  className="w-[200px]"
                />
              </div>
            </Form.Item>
            <Form.Item name="endTime" label="活动结束时间">
              <div className="flex">
                <DatePicker
                  placeholder="请选择活动结束日期"
                  className="w-[200px] mr-[20px]"
                />
                <TimePicker
                  placeholder="请选择活动结束时间"
                  className="w-[200px]"
                />
              </div>
            </Form.Item>
            <Form.Item name="budget" label="初始预算额度">
              <InputNumber placeholder="0" />
            </Form.Item>
            <Form.Item name="file" label="活动封面">
              <Upload
                accept="image/png, image/gif, image/jpeg"
                action="/api/blob/upload"
                isImageUrl={() => true}
                maxCount={1}
                itemRender={(originNode, file, fileList, actions) => {
                  return <></>;
                }}
                // onPreview={()=>console.log('+++')}
                onChange={({ file, fileList, event }) => {
                  if (file.status === "done") {
                    setUploadId(file.response.id);
                  }
                }}
              >
                {uploadId === -1 ? (
                  <Button className="bg-none border-dashed w-[200px] h-[200px]">
                    <PlusOutlined />
                    <div className="mt-[8px]">点击上传图像</div>
                  </Button>
                ) : (
                  <Image
                    src={`/api/blob/${uploadId}`}
                    alt="uploaded file"
                    width={200}
                    height={200}
                    className="border-dashed border-gray-500
                     border-[1px]"
                  />
                )}
              </Upload>
            </Form.Item>
          </Form>
          <div>{UserGroupsInput}</div>
        </div>
        <div className="flex flex-col mr-[200px]">
          {RichTextEditor}
          {AgendaInput}
        </div>
      </div>
      <Button
        type="primary"
        size="large"
        onClick={console.log}
        className="w-[80px] my-[40px]"
      >
        提交
      </Button>
    </div>
  );
}
