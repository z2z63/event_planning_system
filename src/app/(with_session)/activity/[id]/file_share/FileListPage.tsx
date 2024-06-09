"use client";
import { Checkbox, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Attachment, UserGroup } from "@prisma/client";
import { CheckboxOptionType } from "antd/es/checkbox/Group";
import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { uploadAttachment } from "@/app/(with_session)/action";
import "remixicon/fonts/remixicon.css";
import { getAttachmentListByActivityId } from "@/app/lib/data";

export function FileListPage({
  files,
  userGroups,
  activityId,
}: {
  files: Attachment[];
  userGroups: UserGroup[];
  activityId: number;
}) {
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [newFiles, setNewFiles] = useState(files);
  useEffect(() => {
    getAttachmentListByActivityId(activityId).then(setNewFiles);
  }, [activityId, refresh]);

  const options: CheckboxOptionType<number>[] = userGroups.map((e) => ({
    label: e.name,
    value: e.id,
  }));

  function groupSelectChange(value: number[]) {
    setSelectedGroups(value);
  }

  async function postUpload(info: UploadChangeParam<UploadFile>) {
    if (info.file.status === "done") {
      const fileId = info.file.response.id;
      // bit map visibility
      const visibility = selectedGroups.reduce(
        (acc, cur) => acc | (1 << cur),
        0,
      );
      setRefresh(refresh + 1);
      await uploadAttachment(
        fileId,
        visibility,
        activityId,
        info.file.name,
        info.file.size!,
      );
    }
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-wrap justify-around items-center h-[600px] overflow-y-auto">
        {newFiles.map((e) => (
          <FileTile attachment={e} key={e.id} />
        ))}
      </div>
      <div className="mb-[40px] h-[200px] flex justify-center">
        <Upload action="/api/blob/upload" multiple onChange={postUpload}>
          <div className="flex flex-col items-center w-[800px] h-[200px] border border-dashed border-gray-300">
            <InboxOutlined className="text-[96px] text-blue-500" />
            <span className="text-[16px]">点击或拖拽文件到此处上传</span>
            <span className="text-gray-500">
              上传文件前请选择文件可见性，公开的文件将会被所有参与者看到
            </span>
          </div>
        </Upload>
        <div className="flex flex-col mx-[100px]">
          <span className="text-[18px]">允许查看文件的用户组</span>
          <Checkbox.Group onChange={groupSelectChange} className="mt-[10px]">
            <div className="flex flex-col flex-wrap justify-around">
              {options.map((e) => {
                return (
                  <Checkbox
                    value={e.value}
                    key={e.value}
                    className="my-[5px] mx-[20px]"
                  >
                    {e.label}
                  </Checkbox>
                );
              })}
            </div>
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
}

function FileTile({ attachment }: { attachment: Attachment }) {
  return (
    <Link
      href={`/api/blob/${attachment.blobId}?attachment=true&filename=${attachment.filename}`}
      className="flex justify-between items-center w-[500px] h-[100px] transition-[scale] hover:scale-105
       mx-[10px] my-[10px] bg-gray-100 rounded-[10px] hover:shadow-[#0000004C] hover:shadow"
    >
      <div className="flex items-center">
        <div className="text-[36px] m-[20px]">
          <FileIcon ext={attachment.filename.split(".").pop() || ""} />
        </div>
        <div className="flex flex-col">
          <span>{attachment.filename}</span>
          <span className="text-[12px] text-gray-500">
            {dayjs(attachment.time).format("YYYY年MM月DD日HH时MM分")}
          </span>
          <span className="text-[12px] text-gray-500">
            {fileSizeRepr(attachment.size)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FileIcon({ ext }: { ext: string }) {
  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <i className="ri-file-image-fill" />;
    case "pdf":
      return <i className="ri-file-pdf-fill" />;
    case "doc":
    case "docx":
      return <i className="ri-file-word-fill" />;
    case "xls":
    case "xlsx":
      return <i className="ri-file-excel-fill" />;
    case "ppt":
    case "pptx":
      return <i className="ri-file-ppt-fill" />;
    case "zip":
    case "rar":
      return <i className="ri-file-zip-fill" />;
    case "txt":
      return <i className="ri-file-text-fill" />;
    case "c":
    case "cpp":
    case "java":
    case "py":
    case "js":
    case "ts":
    case "h":
    case "hpp":
      return <i className="ri-braces-line" />;
    case "md":
      return <i className="ri-markdown-fill" />;
    default:
      return <i className="ri-file-fill" />;
  }
}

function fileSizeRepr(size: number) {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + "MB";
  } else {
    return (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
  }
}
