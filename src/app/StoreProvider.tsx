"use client";
import { ReactNode, useEffect, useRef } from "react";
import { AppStore, makeStore } from "@/app/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Provider } from "react-redux";

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  useEffect(() => {
    if (storeRef.current != null) {
      return setupListeners(storeRef.current.dispatch);
    }
  }, []);
  return <Provider store={storeRef.current}>{children}</Provider>;
};
