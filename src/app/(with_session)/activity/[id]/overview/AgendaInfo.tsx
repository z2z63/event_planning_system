import { ActivityData } from "@/app/(with_session)/activity/[id]/overview/page";
import { Steps } from "antd";
import { StepProps } from "antd/es/steps";
import dayjs from "dayjs";

export function AgendaInfo({
  data,

  className,
}: {
  data: ActivityData;
  className?: string;
}) {
  const now = Date.now();
  const items: StepProps[] = data.Agenda.map((e) => {
    return {
      title: e.name,
      description: (
        <div className="flex flex-col">
          <span>
            {dayjs(e.startTime).format("YYYY年MM月DD日HH时") +
              " - " +
              dayjs(e.endTime).format("YYYY年MM月DD日HH时")}
          </span>
          <span>{e.info}</span>
        </div>
      ),
      status:
        now < e.startTime.getTime()
          ? "wait"
          : now < e.endTime.getTime()
            ? "process"
            : "finish",
    };
  });

  return (
    <div className={className}>
      <div className="flex flex-col">
        <span className="text-[24px] mx-[10px]">日程安排</span>
        <Steps items={items} direction="vertical" className="mt-[20px]" />
      </div>
    </div>
  );
}
