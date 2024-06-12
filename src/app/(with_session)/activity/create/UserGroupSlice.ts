import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserGroupType = {
  groupName: string;
  id: number;
  info: string;
  mentionProps: { label: string; key: string; value: string }[];
  selected: string[];
};

export type UserGroupsState = {
  seq: number;
  group: UserGroupType[];
};

const initialState: UserGroupsState = {
  seq: 0,
  group: [
    {
      groupName: "组织者组",
      id: 0,
      info: "请输入用户组说明",
      mentionProps: [],
      selected: [],
    },
  ],
};

export const groupSlice = createSlice({
  name: "userGroup",
  initialState,
  reducers: (create) => ({
    addGroup: create.reducer((state) => {
      state.seq++;
      state.group.push({
        groupName: "新建组",
        id: state.seq,
        info: "请输入用户组说明",
        mentionProps: [],
        selected: [],
      });
    }),
    searchUser: create.reducer(
      (
        state,
        action: PayloadAction<{
          groupId: number;
          data: { label: string; key: string; value: string }[];
        }>,
      ) => {
        const it = state.group.findIndex((e) => e.id == action.payload.groupId);
        if (it === -1) {
          throw new Error("id not found");
        }
        state.group[it].mentionProps = action.payload.data;
      },
    ),
    deleteGroup: create.reducer((state, action: PayloadAction<number>) => {
      const it = state.group.findIndex((e) => e.id == action.payload);
      if (it === -1) {
        throw new Error("id not found");
      }
      state.group.splice(it, 1);
    }),
    updateGroupInfo: create.reducer(
      (state, action: PayloadAction<{ id: number; info: string }>) => {
        const it = state.group.findIndex((e) => e.id == action.payload.id);
        if (it === -1) {
          throw new Error("id not found");
        }
        state.group[it].info = action.payload.info;
      },
    ),
    onSelectChange: create.reducer(
      (
        state,
        action: PayloadAction<{ groupId: number; usernameList: string[] }>,
      ) => {
        const it = state.group.findIndex((e) => e.id == action.payload.groupId);
        if (it === -1) {
          throw new Error("id not found");
        }
        state.group[it].selected = action.payload.usernameList;
      },
    ),
  }),
  selectors: {
    selectAllUserGroup: (slice) => slice.group,
  },
});

export const {
  addGroup,
  searchUser,
  deleteGroup,
  onSelectChange,
  updateGroupInfo,
} = groupSlice.actions;

export const { selectAllUserGroup } = groupSlice.selectors;
