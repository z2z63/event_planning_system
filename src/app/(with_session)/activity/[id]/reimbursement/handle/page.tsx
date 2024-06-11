import { getPendingReimbursementList } from "@/app/(with_session)/action";
import { HandleFormList } from "@/app/(with_session)/activity/[id]/reimbursement/handle/HanldeFormList";

export default async function Page({ params }: { params: { id: string } }) {
  const activityId = Number(params.id);
  const data = await getPendingReimbursementList(activityId);
  return <HandleFormList data={data} />;
}
