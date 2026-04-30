"use client";

import { useState } from "react";
import { useLive } from "@/lib/LiveSessionContext";

/**
 * Floating centered banner — client-side only (via dynamic ssr:false in ClientShell).
 * Reads live session from context.
 * Teacher gets an "End Session" button; student can dismiss (locally hides banner).
 */
export default function GlobalLiveSessionBanner() {
  const live = useLive();
  const [ending, setEnding] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!live) return null;
  if (dismissed) return null;

  if (live.status === "loading") {
    return (
      <div className="fixed top-[72px] left-1/2 z-40 -translate-x-1/2 px-3">
        <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/90 px-4 py-2 shadow-sm shadow-black/[0.06] backdrop-blur-sm">
          <svg className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="whitespace-nowrap text-[12px] font-semibold text-slate-500">Connecting to live session…</span>
        </div>
      </div>
    );
  }

  if (live.status === "error" || live.status === "expired") {
    return (
      <div className="fixed top-[72px] left-1/2 z-40 -translate-x-1/2 px-3">
        <div className="flex items-center gap-2.5 rounded-full border border-red-200 bg-red-50/90 px-4 py-2 shadow-sm shadow-red-900/[0.08] backdrop-blur-sm">
          <svg className="h-3.5 w-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="whitespace-nowrap text-[12px] font-semibold text-red-700">
            {live.status === "expired" ? "Session ended" : "Session not found"}
          </span>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="ml-1 rounded-full p-0.5 text-red-400 hover:text-red-600 transition"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ── Ready state ──────────────────────────────────────────────────
  const role = live.isTeacher ? "Teacher" : "Student";
  const partnerRole = live.isTeacher ? "student" : "teacher";

  async function handleEndSession() {
    if (!live?.session?.roomId) return;
    setEnding(true);
    try {
      await fetch(`/api/teacher/live-session?room=${live.session.roomId}`, { method: "DELETE" });
    } finally {
      setEnding(false);
    }
  }

  if (!live.partnerOnline) {
    return (
      <div className="fixed top-[72px] left-1/2 z-40 -translate-x-1/2 px-3">
        <div className="flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50/95 pl-3.5 pr-3 py-2 shadow-sm shadow-amber-900/[0.08] backdrop-blur-sm">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="whitespace-nowrap text-[12px] font-bold text-amber-800">
            Live session · Waiting for {partnerRole}…
          </span>
          {live.isTeacher && (
            <button
              onClick={handleEndSession}
              disabled={ending}
              aria-label="End session"
              title="End live session"
              className="ml-1 flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 hover:bg-amber-200 transition disabled:opacity-50"
            >
              {ending ? "…" : "End"}
            </button>
          )}
          {!live.isTeacher && (
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="ml-1 rounded-full p-0.5 text-amber-500 hover:text-amber-700 transition"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Both online — full live banner
  return (
    <div className="fixed top-[72px] left-1/2 z-40 -translate-x-1/2 px-3">
      <div className="flex items-center gap-3 rounded-full bg-violet-600 pl-3.5 pr-2.5 py-2 shadow-md shadow-violet-900/25">
        {/* Live pulse dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>

        <span className="whitespace-nowrap text-[12px] font-bold text-white">
          Live · {role} · syncing answers
        </span>

        {/* Connected badge */}
        <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-bold text-white/90">Connected</span>
        </span>

        {/* End session (teacher only) */}
        {live.isTeacher && (
          <button
            onClick={handleEndSession}
            disabled={ending}
            aria-label="End live session"
            title="End live session"
            className="flex items-center justify-center rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-white/30 transition disabled:opacity-50"
          >
            {ending ? "…" : "End"}
          </button>
        )}

        {/* Dismiss (student only) */}
        {!live.isTeacher && (
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
