import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TimelineType = {
  agendaName: string;
  id: number;
  content: string;
};
type TimelineState = {
  seq: number;
  agendas: TimelineType[];
};

const initialState: TimelineState = {
  seq: 0,
  agendas: [
    {
      agendaName: "新建议程",
      id: 0,
      content: "请输入议程内容",
    },
  ],
};
export const TimelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: (create) => ({
    addAgenda: create.reducer((state) => {
      state.seq++;
      state.agendas.push({
        agendaName: "新建议程",
        id: state.seq,
        content: "请输入议程内容",
      });
    }),
    deleteAgenda: create.reducer((state, action: PayloadAction<number>) => {
      const it = state.agendas.findIndex((e) => e.id === action.payload);
      if (it === -1) {
        throw new Error("id not found");
      }
      // state.currentFocused = -1;
      state.agendas.splice(it, 1);
    }),
    updateAgendaContent: create.reducer(
      (state, action: PayloadAction<{ id: number; content: string }>) => {
        const it = state.agendas.findIndex((e) => e.id === action.payload.id);
        if (it === -1) {
          throw new Error("id not found");
        }
        state.agendas[it].content = action.payload.content;
      },
    ),
    updateAgendaName: create.reducer(
      (state, action: PayloadAction<{ id: number; agendaName: string }>) => {
        const it = state.agendas.findIndex((e) => e.id === action.payload.id);
        if (it === -1) {
          throw new Error("id not found");
        }
        state.agendas[it].agendaName = action.payload.agendaName;
      },
    ),
  }),
  selectors: {
    selectAllAgenda: (slice) => slice.agendas,
  },
});

export const {
  addAgenda,
  deleteAgenda,
  updateAgendaContent,
  updateAgendaName,
} = TimelineSlice.actions;
export const { selectAllAgenda } = TimelineSlice.selectors;
