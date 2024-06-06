"use client";
import React, { createContext } from "react";

type SessionData = {
  username: string;
  id: number;
};
export const SessionContext = createContext<SessionData>({
  username: "",
  id: -1,
});
export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: {
    username: string;
    id: number;
  };
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
