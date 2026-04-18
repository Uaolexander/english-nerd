"use client";

import { useLive } from "@/lib/LiveSessionContext";

/**
 * Floating centered banner — client-side only (via dynamic ssr:false in ClientShell).
 * Reads live session from context.
 */
export default function GlobalLiveSessionBanner() {
  const live = useLive();
  if (!live) return null;

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
            {live.status === "expired" ? "Session expired" : "Session not found"}
          </span>
        </div>
      </div>
    );
  }

  // ── Ready state ──────────────────────────────────────────────────
  const role = live.isTeacher ? "Teacher" : "Student";
  const partnerRole = live.isTeacher ? "student" : "teacher";

  if (!live.partnerOnline) {
    // Partner offline — amber "waiting" state
    return (
      <div className="fixed top-[72px] left-1/2 z-40 -translate-x-1/2 px-3">
        <div className="flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50/95 pl-3.5 pr-4 py-2 shadow-sm shadow-amber-900/[0.08] backdrop-blur-sm">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="whitespace-nowrap text-[12px] font-bold text-amber-800">
            Live session · Waiting for {partnerRole}…
          </span>
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
      </div>
    </div>
  );
}
