"use client";
import { useEffect, useRef } from "react";
import { useLive } from "@/lib/LiveSessionContext";
import type { LiveSyncPayload } from "@/lib/useLiveSession";

/**
 * Shared hook for live session sync in exercise components.
 * Calls onSync when a broadcast arrives from the partner.
 * Returns broadcast() to send state to the partner.
 */
export function useLiveSync(onSync: (payload: LiveSyncPayload) => void) {
  const live = useLive();
  const onSyncRef = useRef(onSync);
  onSyncRef.current = onSync;

  useEffect(() => {
    if (!live?.lastSync) return;
    onSyncRef.current(live.lastSync);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.lastSync]);

  return {
    isLive: live?.isLive ?? false,
    broadcast: (payload: Omit<LiveSyncPayload, "_senderId">) => {
      if (live?.isLive) live.broadcast(payload);
    },
  };
}
