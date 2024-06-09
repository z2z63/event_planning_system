import { Button } from "antd";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Button href={`/activity/${params.id}/reimbursement/create`}>
      申请报销
    </Button>
  );
}
