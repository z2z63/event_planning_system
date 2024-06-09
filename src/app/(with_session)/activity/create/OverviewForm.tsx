import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Dayjs } from "dayjs";
import { deleteBlobById } from "@/app/lib/data";

export type OverviewFormDataType = {
  activityName: string;
  startTime: Date;
  endTime: Date;
  budget: string;
  fileId: number;
};

export class FormInputIncompleteError extends Error {}

type OverviewFormRawDataType = {
  activityName: string;
  timeRange: [Dayjs, Dayjs];
  budget: string;
  fileId: number;
};

export function useOverviewForm(
  onSubmitFinish: (data: OverviewFormDataType) => void,
) {
  const [fileId, setFileId] = useState(-1);
  const form = useRef<FormInstance | null>(null);

  function triggerFormSubmit() {
    if (form.current === null) {
      throw new Error("no form DOM element");
    }
    form.current.submit();
  }

  function onSubmit(data: OverviewFormRawDataType) {
    const newData: OverviewFormDataType = {
      activityName: data.activityName,
      startTime: data.timeRange[0].toDate(),
      endTime: data.timeRange[1].toDate(),
      budget: data.budget,
      fileId: fileId,
    };
    onSubmitFinish(newData);
  }

  const OverviewForm = (
    <Form
      className="mt-[30px] w-[600px]"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 21 }}
      size="large"
      onFinish={onSubmit}
      ref={form}
    >
      <Form.Item name="activityName" label="活动名称">
        <Input type="text" placeholder="请输入活动名称" className="w-[400px]" />
      </Form.Item>
      <Form.Item name="timeRange" label="活动时间范围">
        <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item name="budget" label="初始预算额度">
        <InputNumber prefix="￥" placeholder="0" />
      </Form.Item>
      <Form.Item name="file" label="活动封面">
        <Upload
          accept="image/png, image/gif, image/jpeg"
          action="/api/blob/upload"
          maxCount={1}
          itemRender={() => <></>}
          onChange={async ({ file, fileList }) => {
            if (file.status === "done") {
              setFileId(file.response.id);
            } else if (file.status === "removed") {
              await deleteBlobById(file.response.id);
              setFileId(-1);
            }
          }}
        >
          {fileId === -1 ? (
            <Button className="bg-none border-dashed w-[200px] h-[200px]">
              <PlusOutlined />
              <div className="mt-[8px]">点击上传图像</div>
            </Button>
          ) : (
            <Image
              src={`/api/blob/${fileId}`}
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
  );
  return { OverviewForm, triggerFormSubmit };
}
