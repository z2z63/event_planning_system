import {
  getAttachmentListByActivityId,
  getUserGroupsByActivityId,
} from "@/app/lib/data";
import { FileListPage } from "@/app/(with_session)/activity/[id]/file_share/FileListPage";

export default async function Page({ params }: { params: { id: string } }) {
  const activityId = Number(params.id);
  const files = await getAttachmentListByActivityId(activityId);
  const groups = await getUserGroupsByActivityId(activityId);
  return (
    <FileListPage files={files} userGroups={groups} activityId={activityId} />
  );
}
