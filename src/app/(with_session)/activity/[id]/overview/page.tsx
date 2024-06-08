import { getActivityBasicInfo } from "@/app/(with_session)/action";
import { BasicInfo } from "@/app/(with_session)/activity/[id]/overview/BasicInfo";
import { UserGroupTable } from "@/app/(with_session)/activity/[id]/overview/UserGroupTable";
import { AgendaInfo } from "@/app/(with_session)/activity/[id]/overview/AgendaInfo";

export type ActivityData = {
  id: number;
  name: string;
  info: string;
  startTime: Date;
  endTime: Date;
  budget: string;
  expenditure: string;
  blobId: number;
  ParticipantGroup: {
    id: number;
    name: string;
    info: string;
    seq: number;
    participants: {
      id: number;
      username: string;
    }[];
  }[];
  Agenda: {
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    info: string;
    activityId: number;
  }[];
};
export default async function Page({ params }: { params: { id: string } }) {
  let data = await getActivityBasicInfo(Number(params.id));
  let newData = {
    ...data,
    budget: data.budget.toFixed(),
    expenditure: data.expenditure.toFixed(),
  };
  return (
    <div className="flex my-[20px]">
      <div className="flex flex-col mx-[60px]">
        <BasicInfo data={newData} />
        <UserGroupTable data={newData} className="mt-[40px]" />
      </div>
      <AgendaInfo data={newData} className="w-[600px]" />
    </div>
  );
}
