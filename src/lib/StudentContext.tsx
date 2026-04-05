"use client";

import { createContext, useContext } from "react";

/** True if the current user is an active student of any teacher (ads hidden) */
const StudentContext = createContext(false);

export function StudentProvider({
  children,
  isStudent,
}: {
  children: React.ReactNode;
  isStudent: boolean;
}) {
  return <StudentContext.Provider value={isStudent}>{children}</StudentContext.Provider>;
}

export function useIsStudent() {
  return useContext(StudentContext);
}
