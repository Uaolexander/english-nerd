"use client";

import { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLiveSession } from "@/lib/useLiveSession";

type LiveSessionCtx = ReturnType<typeof useLiveSession>;

const LiveSessionContext = createContext<LiveSessionCtx | null>(null);

function LiveSessionBridge({
  roomId,
  children,
}: {
  roomId: string | null;
  children: React.ReactNode;
}) {
  const session = useLiveSession(roomId);
  return (
    <LiveSessionContext.Provider value={roomId ? session : null}>
      {children}
    </LiveSessionContext.Provider>
  );
}

function LiveSessionProviderInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  return <LiveSessionBridge roomId={roomId}>{children}</LiveSessionBridge>;
}

/**
 * Reads ?room= reactively via useSearchParams so the live session
 * automatically activates/deactivates as the user navigates between pages.
 * Wrapped in Suspense per Next.js requirements for useSearchParams.
 */
export function LiveSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LiveSessionBridge roomId={null}>{children}</LiveSessionBridge>}>
      <LiveSessionProviderInner>{children}</LiveSessionProviderInner>
    </Suspense>
  );
}

/** Returns the live session from context, or null if no active session. */
export function useLive(): LiveSessionCtx | null {
  return useContext(LiveSessionContext);
}
