"use client";

import { createContext, useContext } from "react";

const ProContext = createContext(false);

export function ProProvider({
  children,
  isPro,
}: {
  children: React.ReactNode;
  isPro: boolean;
}) {
  return <ProContext.Provider value={isPro}>{children}</ProContext.Provider>;
}

export function useIsPro() {
  return useContext(ProContext);
}
