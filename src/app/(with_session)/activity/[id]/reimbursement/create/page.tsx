"use client";
import { Button, Form, Input, InputNumber, Upload } from "antd";
import useRichTextEditor from "@/app/(with_session)/activity/create/RichTextEditor";
import { InboxOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload/interface";
import { deleteBlobById } from "@/app/lib/data";
import { newReimbursement } from "@/app/(with_session)/action";

type FormType1 = {
  title: string;
  amount: string;
  blobIdList: number[];
};

export default function Page({ params }: { params: { id: string } }) {
  const activityId = Number(params.id);
  const { RichTextEditor, getEditorData } = useRichTextEditor(
    "<h4>请输入报销信息，支持富文本，支持markdown</h4>",
  );

  async function onFinish(form: FormType1) {
    await newReimbursement(
      activityId,
      form.title,
      form.amount,
      getEditorData(),
      form.blobIdList,
    );
    window.location.href = `/activity/${activityId}/reimbursement`;
  }

  return (
    <Form
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 8 }}
      className="my-[30px]"
      onFinish={onFinish}
    >
      <Form.Item name="title" label="报销名称">
        <Input />
      </Form.Item>
      <Form.Item name="amount" label="报销金额">
        <InputNumber prefix="￥" />
      </Form.Item>
      <Form.Item name="info" label="情况说明">
        {RichTextEditor}
      </Form.Item>
      <Form.Item name="blobIdList" label="附件上传">
        <MyUpload />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button htmlType="submit" type="primary">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}

function MyUpload({
  id,
  value,
  onChange,
}: {
  id?: string;
  value?: number[];
  onChange?: (value: number[]) => void;
}) {
  async function onUpload({ file, fileList }: UploadChangeParam) {
    if (file.status === "removed") {
      await deleteBlobById(file.response.id);
    }
    onChange?.(
      fileList.filter((e) => e.status === "done").map((e) => e.response.id),
    );
  }

  return (
    <div className="w-[400px]" id={id}>
      <Upload action="/api/blob/upload" multiple onChange={onUpload}>
        <div className="flex flex-col justify-around  items-center w-[400px]  h-[200px] border border-dashed border-gray-300 rounded-[10px] hover:border-blue-500">
          <InboxOutlined className="text-[96px] text-blue-500" />
          <div className="flex flex-col items-center">
            <span className="text-[16px]">点击或拖拽文件到此处上传</span>
            <span className="text-gray-500">
              上传的文件将成为活动组织者审批的依据
            </span>
          </div>
        </div>
      </Upload>
    </div>
  );
}
