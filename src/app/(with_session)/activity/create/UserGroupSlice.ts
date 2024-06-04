import { createSlice } from "@reduxjs/toolkit";

export type UserGroupType = {
  groupName: string;
  id: number;
  data: { label: string; key: string; value: string }[];
};

export type UserGroupsState = {
  seq: number;
  group: UserGroupType[];
};

const initialState: UserGroupsState = {
  seq: 0,
  group: [
    {
      groupName: "默认组",
      id: 0,
      data: [],
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
        data: [],
      });
    }),
    searchUser: create.reducer(
      (
        state,
        action: {
          type: string;
          payload: {
            id: number;
            data: { label: string; key: string; value: string }[];
          };
        },
      ) => {
        const it = state.group.find((e) => e.id == action.payload.id);
        if (it === undefined) {
          throw new Error("id not found");
        }
        it.data = action.payload.data;
      },
    ),
    deleteGroup: create.reducer(
      (state, action: { type: string; payload: number }) => {
        const it = state.group.findIndex((e) => e.id == action.payload);
        if (it === -1) {
          throw new Error("id not found");
        }
        state.group.splice(it, 1);
      },
    ),
  }),
  selectors: {
    selectAllUserGroup: (slice) => slice.group,
  },
});

export const { addGroup, searchUser, deleteGroup } = groupSlice.actions;

export const { selectAllUserGroup } = groupSlice.selectors;
