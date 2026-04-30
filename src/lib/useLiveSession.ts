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
  answers: Record<string, unknown>;
  checked: boolean;
  exNo: number;
  ns?: string;        // namespace — isolates SpeedRound from exercise components
  _senderId?: string;
};

type UseLiveSessionResult = {
  isLive: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  partnerOnline: boolean;
  broadcast: (payload: Omit<LiveSyncPayload, "_senderId">) => void;
  lastSync: LiveSyncPayload | null;
  session: LiveSessionInfo | null;
  status: "loading" | "ready" | "error" | "expired";
};

export function useLiveSession(roomId: string | null): UseLiveSessionResult {
  const [session, setSession] = useState<LiveSessionInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "expired">("loading");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [lastSync, setLastSync] = useState<LiveSyncPayload | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

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
      currentUserIdRef.current = user.id;

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

    // Listen for state sync — ignore echo (messages we sent ourselves)
    channel.on("broadcast", { event: "sync" }, ({ payload }: { payload: LiveSyncPayload }) => {
      if (payload._senderId && payload._senderId === currentUserIdRef.current) return;
      setLastSync({ ...payload });
    });

    // Track presence (who's online)
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const onlineIds = Object.keys(state);
      const partnerId = currentUserId === session.teacherId ? session.studentId : session.teacherId;
      setPartnerOnline(onlineIds.includes(partnerId));
    });

    channel.subscribe(async (subStatus) => {
      if (subStatus === "SUBSCRIBED") {
        await channel.track({ userId: currentUserId, joinedAt: Date.now() });
      }
    });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [status, session, currentUserId]);

  const broadcast = useCallback((payload: Omit<LiveSyncPayload, "_senderId">) => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "sync",
      payload: { ...payload, _senderId: currentUserIdRef.current },
    });
  }, []);

  const isTeacher = !!session && currentUserId === session.teacherId;
  const isStudent = !!session && currentUserId === session.studentId;

  return {
    isLive: status === "ready" && !!session,
    isTeacher,
    isStudent,
    partnerOnline,
    broadcast,
    lastSync,
    session,
    status,
  };
}
