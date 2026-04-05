"use client";

import { createContext, useContext } from "react";

const TeacherContext = createContext(false);

export function TeacherProvider({
  children,
  isTeacher,
}: {
  children: React.ReactNode;
  isTeacher: boolean;
}) {
  return <TeacherContext.Provider value={isTeacher}>{children}</TeacherContext.Provider>;
}

export function useIsTeacher() {
  return useContext(TeacherContext);
}
