"use client";
import { useEffect, useRef, useCallback } from "react";
import { useLive } from "@/lib/LiveSessionContext";
import type { LiveSyncPayload } from "@/lib/useLiveSession";

/**
 * Shared hook for live session sync in exercise components.
 * - onSync: called when a broadcast arrives from the partner
 * - broadcast: sends state to the partner (stable reference via refs)
 * - namespace: optional string that scopes broadcasts so multiple useLiveSync
 *   instances on the same page don't interfere (e.g. SpeedRound vs exercise).
 *   Broadcasts tagged with a namespace are only received by hooks with the same
 *   namespace; untagged broadcasts are only received by hooks without a namespace.
 */
export function useLiveSync(
  onSync: (payload: LiveSyncPayload) => void,
  namespace?: string,
) {
  const live = useLive();

  // Keep refs up-to-date every render so callbacks never close over stale values
  const onSyncRef = useRef(onSync);
  onSyncRef.current = onSync;

  const isLiveRef = useRef(live?.isLive ?? false);
  isLiveRef.current = live?.isLive ?? false;

  const liveBroadcastRef = useRef(live?.broadcast);
  liveBroadcastRef.current = live?.broadcast;

  const namespaceRef = useRef(namespace);
  namespaceRef.current = namespace;

  // Fire onSync only when the namespace matches
  useEffect(() => {
    if (!live?.lastSync) return;
    const payload = live.lastSync;
    // namespace-scoped filtering: each component only handles its own broadcasts
    if (namespaceRef.current !== payload.ns) return;
    onSyncRef.current(payload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.lastSync]);

  // Stable broadcast function — stamps the namespace on every outgoing payload
  const broadcast = useCallback((payload: Omit<LiveSyncPayload, "_senderId">) => {
    if (isLiveRef.current && liveBroadcastRef.current) {
      liveBroadcastRef.current(
        namespaceRef.current ? { ...payload, ns: namespaceRef.current } : payload,
      );
    }
  }, []); // intentionally empty — uses refs for freshness

  return {
    isLive: live?.isLive ?? false,
    broadcast,
  };
}
