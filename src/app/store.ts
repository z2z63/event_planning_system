import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { groupSlice } from "@/app/(with_session)/activity/create/UserGroupSlice";
import { TimelineSlice } from "@/app/(with_session)/activity/create/TimelineSlice";

const rootReducer = combineSlices(groupSlice, TimelineSlice);
export type RootState = ReturnType<typeof rootReducer>;

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export function makeStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
