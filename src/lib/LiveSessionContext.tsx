"use client";

import { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { useLiveSession } from "@/lib/useLiveSession";
import GlobalLiveSessionBanner from "@/components/GlobalLiveSessionBanner";

type LiveSessionCtx = ReturnType<typeof useLiveSession>;

const LiveSessionContext = createContext<LiveSessionCtx | null>(null);

/**
 * Inner component — only rendered when a roomId exists in the URL.
 * Renders the GlobalLiveSessionBanner directly (not via children/context)
 * so it works correctly with React Server Components.
 */
function LiveSessionActive({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  const session = useLiveSession(roomId);
  return (
    <LiveSessionContext.Provider value={session}>
      <GlobalLiveSessionBanner
        status={session.status}
        isTeacher={session.isTeacher}
        partnerOnline={session.partnerOnline}
      />
      {children}
    </LiveSessionContext.Provider>
  );
}

/**
 * Reads `?room=xxx` from the URL.
 * When a room is present, spins up a single useLiveSession instance shared
 * across all children — including exercise components and the global banner.
 * Must be wrapped in <Suspense> in the parent (required by useSearchParams).
 */
export function LiveSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");

  if (!roomId) {
    // No live session — pass null to context so consumers can bail out cheaply
    return (
      <LiveSessionContext.Provider value={null}>
        {children}
      </LiveSessionContext.Provider>
    );
  }

  return <LiveSessionActive roomId={roomId}>{children}</LiveSessionActive>;
}

/** Returns the live session from context, or null if there is no active session. */
export function useLive(): LiveSessionCtx | null {
  return useContext(LiveSessionContext);
}
