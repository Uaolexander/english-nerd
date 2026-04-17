"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLiveSession } from "@/lib/useLiveSession";
import GlobalLiveSessionBanner from "@/components/GlobalLiveSessionBanner";

type LiveSessionCtx = ReturnType<typeof useLiveSession>;

const LiveSessionContext = createContext<LiveSessionCtx | null>(null);

/** Rendered only when a roomId is detected in the URL. */
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
 * Reads ?room= from the URL via useEffect (client-only, no Suspense needed).
 * Avoids the useSearchParams() + Suspense pattern that never re-renders in
 * Next.js App Router layouts.
 */
export function LiveSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRoomId(params.get("room"));
  }, []);

  if (!roomId) {
    return (
      <LiveSessionContext.Provider value={null}>
        {children}
      </LiveSessionContext.Provider>
    );
  }

  return <LiveSessionActive roomId={roomId}>{children}</LiveSessionActive>;
}

/** Returns the live session from context, or null if no active session. */
export function useLive(): LiveSessionCtx | null {
  return useContext(LiveSessionContext);
}
