"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type LiveSessionInfo = {
  roomId: string;
  teacherId: string;
  studentId: string;
  exercisePath: string;
};

export type LiveSyncPayload = {
  answers: Record<string, number | null>;
  checked: boolean;
  exNo: number;
};

type UseLiveSessionResult = {
  /** Whether we are in a valid live session */
  isLive: boolean;
  /** Current user is the teacher in this session */
  isTeacher: boolean;
  /** Current user is the student in this session */
  isStudent: boolean;
  /** Is the other participant currently connected? */
  partnerOnline: boolean;
  /** Broadcast the current exercise state to the partner */
  broadcast: (payload: LiveSyncPayload) => void;
  /** Register a handler called whenever a sync arrives from the partner */
  onSync: (handler: (payload: LiveSyncPayload) => void) => void;
  /** Session info (null while loading) */
  session: LiveSessionInfo | null;
  /** Loading / error state */
  status: "loading" | "ready" | "error" | "expired";
};

export function useLiveSession(roomId: string | null): UseLiveSessionResult {
  const [session, setSession] = useState<LiveSessionInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "expired">("loading");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partnerOnline, setPartnerOnline] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const syncHandlerRef = useRef<((p: LiveSyncPayload) => void) | null>(null);

  // Load current user + session info
  useEffect(() => {
    if (!roomId) {
      setStatus("error");
      return;
    }

    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("error"); return; }
      setCurrentUserId(user.id);

      const res = await fetch(`/api/teacher/live-session?room=${roomId}`);
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setStatus(body.error === "Session expired" ? "expired" : "error");
        return;
      }
      const data = await res.json() as { ok: boolean } & LiveSessionInfo;
      setSession(data);
      setStatus("ready");
    }

    init();
  }, [roomId]);

  // Subscribe to Supabase Realtime channel
  useEffect(() => {
    if (status !== "ready" || !session || !currentUserId) return;

    const supabase = createClient();
    const channelName = `live:${session.roomId}`;

    const channel = supabase.channel(channelName, {
      config: { presence: { key: currentUserId } },
    });

    // Listen for state sync from partner
    channel.on("broadcast", { event: "sync" }, ({ payload }: { payload: LiveSyncPayload }) => {
      syncHandlerRef.current?.(payload);
    });

    // Track presence (who's online)
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const onlineIds = Object.keys(state);
      const partnerId = currentUserId === session.teacherId ? session.studentId : session.teacherId;
      setPartnerOnline(onlineIds.includes(partnerId));
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ userId: currentUserId, joinedAt: Date.now() });
      }
    });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [status, session, currentUserId]);

  const broadcast = useCallback((payload: LiveSyncPayload) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "sync",
      payload,
    });
  }, []);

  const onSync = useCallback((handler: (payload: LiveSyncPayload) => void) => {
    syncHandlerRef.current = handler;
  }, []);

  const isTeacher = !!session && currentUserId === session.teacherId;
  const isStudent = !!session && currentUserId === session.studentId;

  return {
    isLive: status === "ready" && !!session,
    isTeacher,
    isStudent,
    partnerOnline,
    broadcast,
    onSync,
    session,
    status,
  };
}
