import React, { useMemo } from "react";
import { Button, Input, StepProps, Steps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  addAgenda,
  deleteAgenda,
  selectAllAgenda,
  TimelineType,
  updateAgendaContent,
  updateAgendaName,
} from "@/app/(with_session)/activity/create/TimelineSlice";

export default function useAgendaInput() {
  const dispatch = useAppDispatch();
  const allAgenda = useAppSelector(selectAllAgenda);

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

  return (
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
    <Input.TextArea
      className="w-[400px] max-h-[300px] min-h-[100px] my-[20px]"
      key={agenda.id}
      autoSize
      value={agenda.content}
      onChange={(e) =>
        dispatch(
          updateAgendaContent({ id: agenda.id, content: e.target.value }),
        )
      }
    />
  );
}
