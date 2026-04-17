"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLiveSession } from "@/lib/useLiveSession";

type LiveSessionCtx = ReturnType<typeof useLiveSession>;

const LiveSessionContext = createContext<LiveSessionCtx | null>(null);

/**
 * Always rendered with the same component type regardless of whether
 * there's a live session. This keeps the React tree stable — no
 * unmounting/remounting children when the session starts.
 * Never renders extra DOM nodes; only the context value changes.
 */
function LiveSessionBridge({
  roomId,
  children,
}: {
  roomId: string | null;
  children: React.ReactNode;
}) {
  // useLiveSession(null) is cheap — returns immediately with status "error",
  // no network calls, no channel subscriptions.
  const session = useLiveSession(roomId);
  return (
    <LiveSessionContext.Provider value={roomId ? session : null}>
      {children}
    </LiveSessionContext.Provider>
  );
}

/**
 * Reads ?room= from the URL after mount (client-only via useEffect).
 * Avoids hydration mismatches: server always renders the same DOM,
 * context value updates on the client without touching the DOM tree.
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

  return <LiveSessionBridge roomId={roomId}>{children}</LiveSessionBridge>;
}

/** Returns the live session from context, or null if no active session. */
export function useLive(): LiveSessionCtx | null {
  return useContext(LiveSessionContext);
}
