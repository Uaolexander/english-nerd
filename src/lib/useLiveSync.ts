"use client";
import { useEffect, useRef, useCallback } from "react";
import { useLive } from "@/lib/LiveSessionContext";
import type { LiveSyncPayload } from "@/lib/useLiveSession";

/**
 * Shared hook for live session sync in exercise components.
 * - onSync: called when a broadcast arrives from the partner
 * - broadcast: sends state to the partner (stable reference via refs)
 */
export function useLiveSync(onSync: (payload: LiveSyncPayload) => void) {
  const live = useLive();

  // Keep refs up-to-date every render so callbacks never close over stale values
  const onSyncRef = useRef(onSync);
  onSyncRef.current = onSync;

  const isLiveRef = useRef(live?.isLive ?? false);
  isLiveRef.current = live?.isLive ?? false;

  const liveBroadcastRef = useRef(live?.broadcast);
  liveBroadcastRef.current = live?.broadcast;

  // Fire onSync whenever lastSync changes (new broadcast received)
  useEffect(() => {
    if (!live?.lastSync) return;
    onSyncRef.current(live.lastSync);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.lastSync]);

  // Stable broadcast function — never re-created, always reads current live state via refs
  const broadcast = useCallback((payload: Omit<LiveSyncPayload, "_senderId">) => {
    if (isLiveRef.current && liveBroadcastRef.current) {
      liveBroadcastRef.current(payload);
    }
  }, []); // intentionally empty — uses refs for freshness

  return {
    isLive: live?.isLive ?? false,
    broadcast,
  };
}
