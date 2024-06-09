import { getReimbursementList } from "@/app/(with_session)/action";
import ReimbursementList from "@/app/(with_session)/activity/[id]/reimbursement/ReimbursementList";

export default async function Page({ params }: { params: { id: string } }) {
  const activityId = Number(params.id);
  const data = await getReimbursementList(activityId);
  return <ReimbursementList activityId={activityId} data={data} />;
}
