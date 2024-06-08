import React, { useMemo } from "react";
import { Button, DatePicker, Input, StepProps, Steps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  addAgenda,
  deleteAgenda,
  selectAllAgenda,
  TimelineType,
  updateAgendaContent,
  updateAgendaDateRange,
  updateAgendaName,
} from "@/app/(with_session)/activity/create/TimelineSlice";
import { FormInputIncompleteError } from "@/app/(with_session)/activity/create/OverviewForm";
import dayjs from "dayjs";

export default function useAgendaInput() {
  const dispatch = useAppDispatch();
  const allAgenda = useAppSelector(selectAllAgenda);

  function getAgendaData(): Omit<TimelineType, "id">[] {
    for (const agenda of allAgenda) {
      if (agenda.startTime === null || agenda.endTime === null) {
        throw new FormInputIncompleteError("请完成日程日期范围填写");
      }
    }
    return allAgenda;
  }

  const items = useMemo<StepProps[]>(() => {
    let items: StepProps[] = [];
    for (let agenda of allAgenda) {
      items.push({
        title: stepTitle(agenda, dispatch),
        description: StepDescription(agenda, dispatch),
      });
    }
    return items;
  }, [allAgenda, dispatch]);

  const AgendaInput = (
    <div>
      <span className="text-[18px] my-[20px]">议程编辑</span>
      <Steps direction="vertical" className=" mt-[40px]" items={items} />
      <Button
        type="primary"
        onClick={() => {
          dispatch(addAgenda());
          setTimeout(() => {
            window.scroll({
              behavior: "smooth",
              top: document.body.scrollHeight,
            });
          }, 100);
        }}
      >
        添加议程
      </Button>
    </div>
  );
  return { AgendaInput, getAgendaData };
}

function stepTitle(
  agenda: TimelineType,
  dispatch: ReturnType<typeof useAppDispatch>,
) {
  return (
    <div className="flex justify-between pr-[-20px] w-[350px]" key={agenda.id}>
      <Input
        defaultValue={agenda.agendaName}
        className="w-[300px]"
        onChange={(e) =>
          dispatch(
            updateAgendaName({ id: agenda.id, agendaName: e.target.value }),
          )
        }
      />
      <Button
        icon={<DeleteOutlined />}
        danger
        className="mx-[10px]"
        onClick={() => {
          dispatch(deleteAgenda(agenda.id));
        }}
      />
    </div>
  );
}

function StepDescription(
  agenda: TimelineType,
  dispatch: ReturnType<typeof useAppDispatch>,
) {
  return (
    <div key={agenda.id} className="flex flex-col">
      <DatePicker.RangePicker
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        className="w-[400px] mt-[10px]"
        defaultValue={
          agenda.startTime === null && agenda.endTime === null
            ? undefined
            : [dayjs(agenda.startTime), dayjs(agenda.endTime)]
        }
        onChange={(e) => {
          if (e === null) {
            return;
          }
          dispatch(
            updateAgendaDateRange({
              id: agenda.id,
              range: [e[0]?.toDate() ?? null, e[1]?.toDate() ?? null],
            }),
          );
        }}
      />
      <Input.TextArea
        className="w-[400px] max-h-[300px] min-h-[100px] mt-[10px] mb-[20px]"
        autoSize
        defaultValue={agenda.content}
        onChange={(e) =>
          dispatch(
            updateAgendaContent({ id: agenda.id, content: e.target.value }),
          )
        }
      />
    </div>
  );
}
